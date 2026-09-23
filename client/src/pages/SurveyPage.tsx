import { AnswerCard } from "@/components/survey/AnswerCard";
import { OtherInput } from "@/components/survey/OtherInput";
import { QuestionLayout } from "@/components/survey/QuestionLayout";
import { Button } from "@/components/ui/button";
import { QUESTION_FIELD_MAP, questionnaire } from "@/data/questionnaire";
import { hasAnswer, useSurvey } from "@/hooks/useSurvey";
import { submitSurvey, trackEvent } from "@/services/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function SurveyPage() {
  const { answers, toggleOption, setOtherText } = useSurvey();
  const [step, setStep] = useState(0);
  const [showError, setShowError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const question = questionnaire[step]!;
  const isLast = step === questionnaire.length - 1;
  const selected = answers[QUESTION_FIELD_MAP[question.id].answers] as string[];
  const otherText = (answers[QUESTION_FIELD_MAP[question.id].other] as string | undefined) ?? "";
  const otherOption = question.options.find((option) => option.isOther);

  useEffect(() => {
    if (step === 0) void trackEvent("survey_start");
  }, []);

  useEffect(() => {
    void trackEvent("question_view", question.id);
    setShowError(false);
  }, [question.id]);

  function goNext() {
    if (!hasAnswer(answers, question.id)) {
      setShowError(true);
      return;
    }
    if (isLast) {
      void handleSubmit();
      return;
    }
    setStep((value) => value + 1);
  }

  async function handleSubmit() {
    setSubmitting(true);
    try {
      await submitSurvey(answers);
      await trackEvent("survey_complete");
      navigate("/thank-you", { replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not submit your answers.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="survey-shell">
      <div className="relative mx-auto flex min-h-svh w-full max-w-[760px] flex-col px-4 pb-36 pt-6 md:px-6 lg:max-w-6xl">
        <QuestionLayout
          question={question}
          index={step}
          total={questionnaire.length}
          selectedCount={selected.length}
        >
          <div
            className={
              question.layout === "detailed"
                ? "grid gap-3 md:grid-cols-2 xl:grid-cols-3"
                : "grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            }
          >
            {question.options.map((option) => (
              <div key={option.value} className={option.isOther ? "col-span-full" : undefined}>
                <AnswerCard
                  label={option.label}
                  description={option.description}
                  selected={selected.includes(option.value)}
                  detailed={question.layout === "detailed"}
                  onToggle={() => {
                    const result = toggleOption(question.id, option.value);
                    if (result.blocked) toast(result.blocked);
                    setShowError(false);
                  }}
                />
                {option.isOther && otherOption && selected.includes(otherOption.value) ? (
                  <div className="mt-3">
                    <OtherInput value={otherText} onChange={(value) => setOtherText(question.id, value)} />
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </QuestionLayout>
      </div>
      <div className="fixed inset-x-0 bottom-0 z-20 bg-[rgba(32,13,86,0.92)] px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-[760px] items-center justify-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => (step > 0 ? setStep((value) => value - 1) : navigate("/"))}
            className="btn-secondary h-11 min-h-11 min-w-44 !rounded-full border-white/14 bg-transparent px-10 text-white hover:bg-white/5"
          >
            Back
          </Button>
          <Button
            type="button"
            onClick={goNext}
            disabled={submitting}
            className="btn-primary h-11 min-h-11 min-w-44 !rounded-full px-10 text-base font-semibold text-white"
          >
            {submitting ? "Submitting..." : isLast ? "Submit" : "Continue"}
          </Button>
        </div>
        {showError ? (
          <p className="mx-auto mt-2 max-w-[760px] text-center text-sm text-[#FF6B81]">
            Please choose at least one answer.
          </p>
        ) : null}
      </div>
    </div>
  );
}
