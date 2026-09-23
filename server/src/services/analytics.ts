import { questionnaire, getOptionLabel } from "../../../shared/questionnaire";
import type {
  AnalyticsItem,
  AnalyticsResponse,
  OtherAnswersResponse,
  OverviewResponse,
  QuestionId,
  ResponsesListResponse,
  SurveyLanguage,
  SurveyResponseDoc,
} from "../../../shared/types";
import { isSurveyLanguage } from "../../../shared/types";
import { getSupabase } from "./supabase";
import {
  getMemoryResponse,
  isSupabaseConfigured,
  listMemoryEvents,
  listMemoryResponses,
  type StoredResponse as MemoryResponse,
} from "./store";

export type FilterInput = {
  from?: string;
  to?: string;
  category?: string;
  page?: number;
  limit?: number;
};

type StoredResponse = {
  id: string;
  answers: {
    categories: string[];
    categories_other?: string | null;
    current_method: string[];
    current_method_other?: string | null;
    preferred_discovery: string[];
    preferred_discovery_other?: string | null;
    trust_factors: string[];
    trust_factors_other?: string | null;
    barriers: string[];
    barriers_other?: string | null;
  };
  metadata: {
    submittedAt?: { toDate?: () => Date } | Date | string;
    questionnaireVersion: "1.0";
    language: SurveyLanguage;
    deviceType?: "mobile" | "tablet" | "desktop";
    userAgent?: string | null;
  };
};

function parseDate(value?: string): Date | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function toIso(value: StoredResponse["metadata"]["submittedAt"]): string {
  if (!value) return new Date(0).toISOString();
  if (typeof value === "string") return value;
  if (value instanceof Date) return value.toISOString();
  if (typeof value.toDate === "function") return value.toDate().toISOString();
  return new Date(0).toISOString();
}

type ResponseRow = {
  id: string;
  answers: StoredResponse["answers"];
  questionnaire_version: "1.0";
  language: string | null;
  device_type?: "mobile" | "tablet" | "desktop" | null;
  user_agent?: string | null;
  submitted_at: string;
};

type EventRow = {
  event?: string;
  question_id?: QuestionId | null;
  created_at?: string;
};

function rowToStored(row: ResponseRow): StoredResponse {
  return {
    id: row.id,
    answers: row.answers,
    metadata: {
      submittedAt: row.submitted_at,
      questionnaireVersion: row.questionnaire_version,
      language: isSurveyLanguage(row.language) ? row.language : "en",
      deviceType: row.device_type ?? undefined,
      userAgent: row.user_agent,
    },
  };
}

function matchesFilters(doc: StoredResponse, filters: FilterInput) {
  const from = parseDate(filters.from);
  const to = parseDate(filters.to);
  const submitted = new Date(toIso(doc.metadata.submittedAt));
  if (from && submitted < from) return false;
  if (to && submitted > to) return false;
  if (filters.category && filters.category !== "all" && !doc.answers.categories.includes(filters.category)) {
    return false;
  }
  return true;
}

async function loadResponses(filters: FilterInput): Promise<StoredResponse[]> {
  if (!isSupabaseConfigured()) {
    return listMemoryResponses()
      .map((doc) => memoryToStored(doc))
      .filter((doc) => matchesFilters(doc, filters));
  }

  const from = parseDate(filters.from);
  const to = parseDate(filters.to);
  let query = getSupabase().from("survey_responses").select("*");
  if (from) query = query.gte("submitted_at", from.toISOString());
  if (to) query = query.lte("submitted_at", to.toISOString());
  const { data, error } = await query;
  if (error) throw error;

  return ((data ?? []) as ResponseRow[])
    .map(rowToStored)
    .filter((doc) => matchesFilters(doc, { ...filters, from: undefined, to: undefined }));
}

function memoryToStored(doc: MemoryResponse): StoredResponse {
  return {
    id: doc.id,
    answers: doc.answers,
    metadata: {
      ...doc.metadata,
      submittedAt: doc.metadata.submittedAt,
    },
  };
}

function countOptions(values: string[][], questionId: QuestionId, total: number): AnalyticsItem[] {
  const question = questionnaire.find((item) => item.id === questionId)!;
  const counts = new Map<string, number>();
  for (const option of question.options) counts.set(option.value, 0);
  for (const selected of values) {
    for (const value of new Set(selected)) {
      counts.set(value, (counts.get(value) ?? 0) + 1);
    }
  }

  return question.options.map((option) => {
    const count = counts.get(option.value) ?? 0;
    return {
      key: option.value,
      label: option.label,
      count,
      percentage: total === 0 ? 0 : Number(((count / total) * 100).toFixed(2)),
    };
  });
}

function topItem(items: AnalyticsItem[]): AnalyticsItem | null {
  const ranked = items.filter((item) => item.key !== "other" && item.key !== "none");
  return ranked.sort((a, b) => b.count - a.count)[0] ?? null;
}

function toPublicDoc(doc: StoredResponse): SurveyResponseDoc {
  return {
    id: doc.id,
    answers: {
      categories: doc.answers.categories ?? [],
      categories_other: doc.answers.categories_other ?? undefined,
      current_method: doc.answers.current_method ?? [],
      current_method_other: doc.answers.current_method_other ?? undefined,
      preferred_discovery: doc.answers.preferred_discovery ?? [],
      preferred_discovery_other: doc.answers.preferred_discovery_other ?? undefined,
      trust_factors: doc.answers.trust_factors ?? [],
      trust_factors_other: doc.answers.trust_factors_other ?? undefined,
      barriers: doc.answers.barriers ?? [],
      barriers_other: doc.answers.barriers_other ?? undefined,
    },
    metadata: {
      submittedAt: toIso(doc.metadata.submittedAt),
      questionnaireVersion: doc.metadata.questionnaireVersion,
      language: doc.metadata.language,
      deviceType: doc.metadata.deviceType,
      userAgent: doc.metadata.userAgent ?? undefined,
    },
  };
}

export async function getQuestionAnalytics(
  questionId: QuestionId,
  field: keyof StoredResponse["answers"],
  filters: FilterInput,
): Promise<AnalyticsResponse> {
  const responses = await loadResponses(filters);
  const items = countOptions(
    responses.map((response) => (response.answers[field] as string[]) ?? []),
    questionId,
    responses.length,
  );
  return { totalResponses: responses.length, items };
}

export async function getOverview(filters: FilterInput): Promise<OverviewResponse> {
  const responses = await loadResponses(filters);
  const from = parseDate(filters.from);
  const to = parseDate(filters.to);

  const questionViews: Record<QuestionId, number> = {
    categories: 0,
    currentMethod: 0,
    preferredDiscovery: 0,
    trustFactors: 0,
    barriers: 0,
  };
  let landingViews = 0;
  let started = 0;
  let completed = 0;

  const eventRows = isSupabaseConfigured()
    ? await (async () => {
        let query = getSupabase().from("survey_events").select("event, question_id, created_at");
        if (from) query = query.gte("created_at", from.toISOString());
        if (to) query = query.lte("created_at", to.toISOString());
        const { data, error } = await query;
        if (error) throw error;
        return ((data ?? []) as EventRow[]).map((row) => ({
          event: row.event,
          questionId: row.question_id ?? undefined,
        }));
      })()
    : listMemoryEvents().filter((event) => {
        if (from && event.createdAt < from) return false;
        if (to && event.createdAt > to) return false;
        return true;
      });

  for (const data of eventRows) {
    if (data.event === "landing_view") landingViews += 1;
    if (data.event === "survey_start") started += 1;
    if (data.event === "survey_complete") completed += 1;
    if (data.event === "question_view" && data.questionId) {
      questionViews[data.questionId as QuestionId] += 1;
    }
  }

  const categories = countOptions(
    responses.map((response) => response.answers.categories ?? []),
    "categories",
    responses.length,
  );
  const discovery = countOptions(
    responses.map((response) => response.answers.preferred_discovery ?? []),
    "preferredDiscovery",
    responses.length,
  );
  const trust = countOptions(
    responses.map((response) => response.answers.trust_factors ?? []),
    "trustFactors",
    responses.length,
  );
  const barriers = countOptions(
    responses.map((response) => response.answers.barriers ?? []),
    "barriers",
    responses.length,
  );

  return {
    totalResponses: responses.length,
    started,
    completed: completed || responses.length,
    completionRate: started === 0 ? 0 : Number((((completed || responses.length) / started) * 100).toFixed(1)),
    startRate: landingViews === 0 ? 0 : Number(((started / landingViews) * 100).toFixed(1)),
    landingViews,
    topCategory: topItem(categories),
    topDiscovery: topItem(discovery),
    topTrust: topItem(trust),
    topBarrier: topItem(barriers),
    dropOff: (Object.keys(questionViews) as QuestionId[]).map((questionId) => ({
      questionId,
      views: questionViews[questionId],
    })),
  };
}

export async function getResponses(filters: FilterInput): Promise<ResponsesListResponse> {
  const responses = await loadResponses(filters);
  const sorted = responses.sort(
    (a, b) => new Date(toIso(b.metadata.submittedAt)).getTime() - new Date(toIso(a.metadata.submittedAt)).getTime(),
  );
  const page = filters.page ?? 1;
  const limit = filters.limit ?? 25;
  const start = (page - 1) * limit;

  return {
    items: sorted.slice(start, start + limit).map(toPublicDoc),
    page,
    limit,
    total: sorted.length,
  };
}

export async function getResponseById(id: string): Promise<SurveyResponseDoc | null> {
  if (!isSupabaseConfigured()) {
    const memory = getMemoryResponse(id);
    return memory ? toPublicDoc(memoryToStored(memory)) : null;
  }
  const { data, error } = await getSupabase().from("survey_responses").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return toPublicDoc(rowToStored(data as ResponseRow));
}

export async function getOtherAnswers(filters: FilterInput): Promise<OtherAnswersResponse> {
  const responses = await loadResponses(filters);
  const collect = (value?: string | null) => (value && value.trim() ? value.trim() : null);

  return {
    categories: responses.map((item) => collect(item.answers.categories_other)).filter((item): item is string => Boolean(item)),
    currentMethod: responses
      .map((item) => collect(item.answers.current_method_other))
      .filter((item): item is string => Boolean(item)),
    preferredDiscovery: responses
      .map((item) => collect(item.answers.preferred_discovery_other))
      .filter((item): item is string => Boolean(item)),
    trustFactors: responses
      .map((item) => collect(item.answers.trust_factors_other))
      .filter((item): item is string => Boolean(item)),
    barriers: responses.map((item) => collect(item.answers.barriers_other)).filter((item): item is string => Boolean(item)),
  };
}

export { getOptionLabel };
