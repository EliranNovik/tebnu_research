import type {
  AnalyticsResponse,
  OtherAnswersResponse,
  OverviewResponse,
  ResponsesListResponse,
  SurveyAnswers,
  SurveyEventName,
  SurveyLanguage,
  SurveyResponseDoc,
  QuestionId,
} from "@/types/survey";
import { QUESTIONNAIRE_VERSION } from "@/data/questionnaire";
import { getSessionId } from "@/utils/session";

export function apiUrl(path: string) {
  const base = String(import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");
  return `${base}${path}`;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(apiUrl(path), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error ?? "Request failed");
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export async function submitSurvey(answers: SurveyAnswers, language: SurveyLanguage) {
  return request<{ ok: true; id: string }>("/api/survey", {
    method: "POST",
    body: JSON.stringify({
      answers,
      questionnaireVersion: QUESTIONNAIRE_VERSION,
      language,
    }),
  });
}

export async function trackEvent(event: SurveyEventName, questionId?: QuestionId) {
  try {
    await request("/api/survey/events", {
      method: "POST",
      body: JSON.stringify({
        sessionId: getSessionId(),
        event,
        questionId,
      }),
    });
  } catch {
    // Funnel tracking should never block the questionnaire.
  }
}

export function buildQuery(params: Record<string, string | undefined>) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) search.set(key, value);
  });
  const query = search.toString();
  return query ? `?${query}` : "";
}

export async function adminRequest<T>(path: string, token: string): Promise<T> {
  return request<T>(path, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export type AdminFilters = {
  from?: string;
  to?: string;
  category?: string;
  page?: string;
  limit?: string;
};

export type AdminQueryLoader<T> = ((token: string, filters: AdminFilters) => Promise<T>) & {
  queryKey: string;
};

function defineQuery<T>(queryKey: string, path: string): AdminQueryLoader<T> {
  const load = ((token: string, filters: AdminFilters) =>
    adminRequest<T>(`${path}${buildQuery(filters)}`, token)) as AdminQueryLoader<T>;
  load.queryKey = queryKey;
  return load;
}

export const adminApi = {
  overview: defineQuery<OverviewResponse>("overview", "/api/admin/overview"),
  responses: defineQuery<ResponsesListResponse>("responses", "/api/admin/responses"),
  response: (token: string, id: string) => adminRequest<SurveyResponseDoc>(`/api/admin/responses/${id}`, token),
  categories: defineQuery<AnalyticsResponse>("categories", "/api/admin/analytics/categories"),
  currentMethod: defineQuery<AnalyticsResponse>("current-method", "/api/admin/analytics/current-method"),
  discovery: defineQuery<AnalyticsResponse>("discovery", "/api/admin/analytics/discovery"),
  trust: defineQuery<AnalyticsResponse>("trust", "/api/admin/analytics/trust"),
  barriers: defineQuery<AnalyticsResponse>("barriers", "/api/admin/analytics/barriers"),
  other: defineQuery<OtherAnswersResponse>("other", "/api/admin/analytics/other"),
};
