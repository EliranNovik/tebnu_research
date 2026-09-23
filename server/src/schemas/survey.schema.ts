import { z } from "zod";
import { questionnaire } from "../../../shared/questionnaire";
import { QUESTIONNAIRE_VERSION, type QuestionId } from "../../../shared/types";
import { sanitizeOtherText } from "../utils/sanitize";

const OTHER_MAX = 300;

const questionIds = [
  "categories",
  "currentMethod",
  "preferredDiscovery",
  "trustFactors",
  "barriers",
] as const satisfies QuestionId[];

function validateQuestion(questionId: QuestionId, values: string[], other?: string): string | null {
  const question = questionnaire.find((item) => item.id === questionId);
  if (!question) return "Unknown question";

  const allowed = new Set(question.options.map((option) => option.value));
  const unique = [...new Set(values)];
  const exclusive = question.options.find((option) => option.exclusive)?.value;
  const otherOption = question.options.find((option) => option.isOther)?.value;

  if (unique.length === 0) return "At least one answer is required";
  if (unique.length !== values.length) return "Duplicate selections are not allowed";
  if (unique.some((value) => !allowed.has(value))) return "Invalid option selected";
  if (exclusive && unique.includes(exclusive) && unique.length > 1) {
    return "That option cannot be combined with others";
  }
  if (question.maxSelections && unique.length > question.maxSelections) {
    return `Maximum ${question.maxSelections} selections allowed`;
  }
  if (other && otherOption && !unique.includes(otherOption)) {
    return "Other text requires Other to be selected";
  }
  return null;
}

export const surveySubmitSchema = z
  .object({
    questionnaireVersion: z.literal(QUESTIONNAIRE_VERSION),
    answers: z.object({
      categories: z.array(z.string()),
      categoriesOther: z.string().max(OTHER_MAX).optional(),
      currentMethod: z.array(z.string()),
      currentMethodOther: z.string().max(OTHER_MAX).optional(),
      preferredDiscovery: z.array(z.string()),
      preferredDiscoveryOther: z.string().max(OTHER_MAX).optional(),
      trustFactors: z.array(z.string()),
      trustFactorsOther: z.string().max(OTHER_MAX).optional(),
      barriers: z.array(z.string()),
      barriersOther: z.string().max(OTHER_MAX).optional(),
    }),
  })
  .superRefine((payload, ctx) => {
    const pairs: Array<[QuestionId, string[], string | undefined]> = [
      ["categories", payload.answers.categories, payload.answers.categoriesOther],
      ["currentMethod", payload.answers.currentMethod, payload.answers.currentMethodOther],
      ["preferredDiscovery", payload.answers.preferredDiscovery, payload.answers.preferredDiscoveryOther],
      ["trustFactors", payload.answers.trustFactors, payload.answers.trustFactorsOther],
      ["barriers", payload.answers.barriers, payload.answers.barriersOther],
    ];

    for (const [id, values, other] of pairs) {
      const error = validateQuestion(id, values, other);
      if (error) {
        ctx.addIssue({ code: "custom", message: error, path: ["answers", id] });
      }
    }
  })
  .transform((payload) => ({
    questionnaireVersion: payload.questionnaireVersion,
    answers: {
      ...payload.answers,
      categoriesOther: sanitizeOtherText(payload.answers.categoriesOther),
      currentMethodOther: sanitizeOtherText(payload.answers.currentMethodOther),
      preferredDiscoveryOther: sanitizeOtherText(payload.answers.preferredDiscoveryOther),
      trustFactorsOther: sanitizeOtherText(payload.answers.trustFactorsOther),
      barriersOther: sanitizeOtherText(payload.answers.barriersOther),
    },
  }));

export const surveyEventSchema = z.object({
  sessionId: z.string().min(8).max(80).regex(/^[a-zA-Z0-9_-]+$/),
  event: z.enum(["landing_view", "survey_start", "question_view", "survey_complete"]),
  questionId: z.enum(questionIds).optional(),
});

export const analyticsQuerySchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
  category: z.string().optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});
