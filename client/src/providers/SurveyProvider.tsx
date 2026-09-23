import { QUESTION_FIELD_MAP } from "@/data/questionnaire";
import { applyToggle, emptyAnswers, SurveyContext, type SurveyContextValue } from "@/hooks/useSurvey";
import type { QuestionId, SurveyAnswers } from "@/types/survey";
import { useMemo, useState, type ReactNode } from "react";

export function SurveyProvider({ children }: { children: ReactNode }) {
  const [answers, setAnswers] = useState<SurveyAnswers>(emptyAnswers);

  const value = useMemo<SurveyContextValue>(
    () => ({
      answers,
      toggleOption: (questionId, value) => {
        const result = applyToggle(answers, questionId, value);
        if (!result.blocked) setAnswers(result.next);
        return { blocked: result.blocked };
      },
      setOtherText: (questionId: QuestionId, value: string) => {
        const field = QUESTION_FIELD_MAP[questionId].other;
        setAnswers((current) => ({ ...current, [field]: value || undefined }));
      },
      reset: () => setAnswers(emptyAnswers),
    }),
    [answers],
  );

  return <SurveyContext.Provider value={value}>{children}</SurveyContext.Provider>;
}
