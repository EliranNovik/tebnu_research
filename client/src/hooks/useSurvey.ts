import { QUESTION_FIELD_MAP, getQuestion } from "@/data/questionnaire";
import type { QuestionId, SurveyAnswers } from "@/types/survey";
import { createContext, useContext } from "react";

export const emptyAnswers: SurveyAnswers = {
  categories: [],
  currentMethod: [],
  preferredDiscovery: [],
  trustFactors: [],
  barriers: [],
};

export type SurveyContextValue = {
  answers: SurveyAnswers;
  toggleOption: (questionId: QuestionId, value: string) => { blocked?: string };
  setOtherText: (questionId: QuestionId, value: string) => void;
  reset: () => void;
};

export const SurveyContext = createContext<SurveyContextValue | null>(null);

export function useSurvey() {
  const ctx = useContext(SurveyContext);
  if (!ctx) throw new Error("useSurvey must be used within SurveyProvider");
  return ctx;
}

export function applyToggle(
  answers: SurveyAnswers,
  questionId: QuestionId,
  value: string,
): { next: SurveyAnswers; blocked?: string } {
  const question = getQuestion(questionId);
  const fields = QUESTION_FIELD_MAP[questionId];
  const selected = [...(answers[fields.answers] as string[])];
  const option = question.options.find((item) => item.value === value);
  const exclusiveValue = question.options.find((item) => item.exclusive)?.value;
  const isSelected = selected.includes(value);

  if (isSelected) {
    const nextSelected = selected.filter((item) => item !== value);
    return {
      next: {
        ...answers,
        [fields.answers]: nextSelected,
        ...(option?.isOther ? { [fields.other]: undefined } : {}),
      },
    };
  }

  if (option?.exclusive) {
    return {
      next: {
        ...answers,
        [fields.answers]: [value],
        [fields.other]: undefined,
      },
    };
  }

  let nextSelected = exclusiveValue ? selected.filter((item) => item !== exclusiveValue) : selected;

  if (question.maxSelections && nextSelected.length >= question.maxSelections) {
    return { next: answers, blocked: `You can choose up to ${question.maxSelections}.` };
  }

  nextSelected = [...nextSelected, value];
  return { next: { ...answers, [fields.answers]: nextSelected } };
}

export function hasAnswer(answers: SurveyAnswers, questionId: QuestionId) {
  const field = QUESTION_FIELD_MAP[questionId].answers;
  return (answers[field] as string[]).length > 0;
}
