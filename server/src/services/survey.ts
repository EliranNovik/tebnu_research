import type { SurveyAnswers } from "../../../shared/types";
import { deviceTypeFromUserAgent } from "../utils/sanitize";
import { notifyAdminChange } from "./live";
import { isSupabaseConfigured } from "./store";
import { getSupabase } from "./supabase";
import { addMemoryEvent, addMemoryResponse } from "./store";

export async function saveSurveyResponse(input: {
  answers: SurveyAnswers;
  questionnaireVersion: "1.0";
  userAgent?: string;
}) {
  const answers = {
    categories: input.answers.categories,
    categories_other: input.answers.categoriesOther ?? null,
    current_method: input.answers.currentMethod,
    current_method_other: input.answers.currentMethodOther ?? null,
    preferred_discovery: input.answers.preferredDiscovery,
    preferred_discovery_other: input.answers.preferredDiscoveryOther ?? null,
    trust_factors: input.answers.trustFactors,
    trust_factors_other: input.answers.trustFactorsOther ?? null,
    barriers: input.answers.barriers,
    barriers_other: input.answers.barriersOther ?? null,
  };

  if (!isSupabaseConfigured()) {
    const id = addMemoryResponse({
      answers,
      metadata: {
        submittedAt: new Date(),
        questionnaireVersion: input.questionnaireVersion,
        language: "en",
        deviceType: deviceTypeFromUserAgent(input.userAgent),
        userAgent: input.userAgent?.slice(0, 300) ?? null,
      },
    });
    notifyAdminChange();
    return id;
  }

  const { data, error } = await getSupabase()
    .from("survey_responses")
    .insert({
      answers,
      questionnaire_version: input.questionnaireVersion,
      language: "en",
      device_type: deviceTypeFromUserAgent(input.userAgent),
      user_agent: input.userAgent?.slice(0, 300) ?? null,
    })
    .select("id")
    .single();

  if (error) throw error;
  notifyAdminChange();
  return data.id as string;
}

export async function saveSurveyEvent(input: {
  sessionId: string;
  event: "landing_view" | "survey_start" | "question_view" | "survey_complete";
  questionId?: string;
}) {
  if (!isSupabaseConfigured()) {
    addMemoryEvent({
      sessionId: input.sessionId,
      event: input.event,
      questionId: input.questionId ?? null,
      createdAt: new Date(),
    });
    notifyAdminChange();
    return;
  }

  const { error } = await getSupabase().from("survey_events").insert({
    session_id: input.sessionId,
    event: input.event,
    question_id: input.questionId ?? null,
  });
  if (error) throw error;
  notifyAdminChange();
}
