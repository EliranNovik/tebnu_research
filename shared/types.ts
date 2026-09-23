export const QUESTIONNAIRE_VERSION = "1.0" as const;
export type QuestionnaireVersion = typeof QUESTIONNAIRE_VERSION;

export const SURVEY_LANGUAGES = ["en", "ru", "fr", "he"] as const;
export type SurveyLanguage = (typeof SURVEY_LANGUAGES)[number];

export function isSurveyLanguage(value: string | null | undefined): value is SurveyLanguage {
  return value === "en" || value === "ru" || value === "fr" || value === "he";
}

export type QuestionId =
  | "categories"
  | "currentMethod"
  | "preferredDiscovery"
  | "trustFactors"
  | "barriers";

export type DeviceType = "mobile" | "tablet" | "desktop";

export type SurveyAnswers = {
  categories: string[];
  categoriesOther?: string;
  currentMethod: string[];
  currentMethodOther?: string;
  preferredDiscovery: string[];
  preferredDiscoveryOther?: string;
  trustFactors: string[];
  trustFactorsOther?: string;
  barriers: string[];
  barriersOther?: string;
};

export type SurveySubmitRequest = {
  answers: SurveyAnswers;
  questionnaireVersion: QuestionnaireVersion;
  language?: SurveyLanguage;
};

export type SurveySubmitResponse = {
  ok: true;
  id: string;
};

export type SurveyEventName =
  | "landing_view"
  | "survey_start"
  | "question_view"
  | "survey_complete";

export type SurveyEventRequest = {
  sessionId: string;
  event: SurveyEventName;
  questionId?: QuestionId;
};

export type DatePreset = "today" | "7d" | "30d" | "all" | "custom";

export type AnalyticsFilters = {
  from?: string;
  to?: string;
  category?: string;
  page?: number;
  limit?: number;
};

export type AnalyticsItem = {
  key: string;
  label: string;
  count: number;
  percentage: number;
};

export type AnalyticsResponse = {
  totalResponses: number;
  items: AnalyticsItem[];
};

export type OverviewResponse = {
  totalResponses: number;
  started: number;
  completed: number;
  completionRate: number;
  startRate: number;
  landingViews: number;
  topCategory: AnalyticsItem | null;
  topDiscovery: AnalyticsItem | null;
  topTrust: AnalyticsItem | null;
  topBarrier: AnalyticsItem | null;
  dropOff: { questionId: QuestionId; views: number }[];
};

export type SurveyResponseDoc = {
  id: string;
  answers: {
    categories: string[];
    categories_other?: string;
    current_method: string[];
    current_method_other?: string;
    preferred_discovery: string[];
    preferred_discovery_other?: string;
    trust_factors: string[];
    trust_factors_other?: string;
    barriers: string[];
    barriers_other?: string;
  };
  metadata: {
    submittedAt: string;
    questionnaireVersion: QuestionnaireVersion;
    language: SurveyLanguage;
    deviceType?: DeviceType;
    userAgent?: string;
  };
};

export type ResponsesListResponse = {
  items: SurveyResponseDoc[];
  page: number;
  limit: number;
  total: number;
};

export type OtherAnswersResponse = {
  categories: string[];
  currentMethod: string[];
  preferredDiscovery: string[];
  trustFactors: string[];
  barriers: string[];
};
