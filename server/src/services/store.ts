import { randomUUID } from "node:crypto";
import type { SurveyLanguage } from "../../../shared/types";

export type StoredResponse = {
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
    submittedAt: Date;
    questionnaireVersion: "1.0";
    language: SurveyLanguage;
    deviceType?: "mobile" | "tablet" | "desktop";
    userAgent?: string | null;
  };
};

export type StoredEvent = {
  id: string;
  sessionId: string;
  event: "landing_view" | "survey_start" | "question_view" | "survey_complete";
  questionId?: string | null;
  createdAt: Date;
};

const responses: StoredResponse[] = [];
const events: StoredEvent[] = [];

export function isSupabaseConfigured() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export function addMemoryResponse(doc: Omit<StoredResponse, "id">) {
  const id = randomUUID();
  responses.unshift({ ...doc, id });
  return id;
}

export function listMemoryResponses() {
  return responses;
}

export function getMemoryResponse(id: string) {
  return responses.find((item) => item.id === id) ?? null;
}

export function addMemoryEvent(doc: Omit<StoredEvent, "id">) {
  events.push({ ...doc, id: randomUUID() });
}

export function listMemoryEvents() {
  return events;
}
