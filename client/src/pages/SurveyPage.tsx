import { AnswerCard } from "@/components/survey/AnswerCard";
import { OtherInput } from "@/components/survey/OtherInput";
import { QuestionLayout } from "@/components/survey/QuestionLayout";
import { Button } from "@/components/ui/button";
import { QUESTION_FIELD_MAP, questionnaire } from "@/data/questionnaire";
import { hasAnswer, useSurvey } from "@/hooks/useSurvey";
import { fill, languageChoices, optionText, packFor, readLanguage, writeLanguage } from "@/locales";
import { cn } from "@/lib/utils";
import { submitSurvey, trackEvent } from "@/services/api";
import type { SurveyLanguage } from "@/types/survey";
import { Languages } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function SurveyPage() {
  const { answers, toggleOption, setOtherText } = useSurvey();
  const [stage, setStage] = useState<"language" | "questions">("language");
  const [language, setLanguage] = useState<SurveyLanguage | null>(() => readLanguage());
  const [step, setStep] = useState(0);
  const [showError, setShowError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const started = useRef(false);
  const navigate = useNavigate();
  const copy = packFor(language);
  const question = questionnaire[step]!;
  const isLast = step === questionnaire.length - 1;
  const selected = answers[QUESTION_FIELD_MAP[question.id].answers] as string[];
  const otherText = (answers[QUESTION_FIELD_MAP[question.id].other] as string | undefined) ?? "";
  const otherOption = question.options.find((option) => option.isOther);
  const questionCopy = copy.questions[question.id];
  const max = question.maxSelections;

  const rtl = stage === "questions" && language === "he";

  useEffect(() => {
    const lang = language ?? "en";
    const previousLang = document.documentElement.lang;
    const previousDir = document.documentElement.dir;
    document.documentElement.lang = lang;
    document.documentElement.dir = rtl ? "rtl" : "ltr";
    return () => {
      document.documentElement.lang = previousLang || "en";
      document.documentElement.dir = previousDir || "ltr";
    };
  }, [language, rtl]);

  useEffect(() => {
    if (stage !== "questions") return;
    void trackEvent("question_view", question.id);
    setShowError(false);
  }, [stage, question.id]);

  function chooseLanguage(next: SurveyLanguage) {
    setLanguage(next);
    writeLanguage(next);
  }

  function beginQuestions() {
    if (!language) return;
    writeLanguage(language);
    setStage("questions");
    if (!started.current) {
      started.current = true;
      void trackEvent("survey_start");
    }
  }

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
    if (!language) return;
    setSubmitting(true);
    try {
      await submitSurvey(answers, language);
      await trackEvent("survey_complete");
      navigate("/thank-you", { replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : copy.submitError);
    } finally {
      setSubmitting(false);
    }
  }

  const selectionText =
    max && questionCopy.subtitle
      ? fill(selected.length >= max ? copy.selectedMax : copy.selected, {
          count: selected.length,
          max,
        })
      : undefined;

  return (
    <div className="survey-shell" lang={language ?? "en"} dir={rtl ? "rtl" : "ltr"}>
      <div className="relative mx-auto flex min-h-svh w-full max-w-[760px] flex-col px-4 pb-36 pt-6 md:px-6 lg:max-w-6xl">
        {stage === "language" ? (
          <div className="question-enter mx-auto w-full max-w-3xl">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-white/6 text-[#A993EB]">
                <Languages className="size-5" />
              </div>
              <h1 className="text-[26px] font-bold leading-tight text-white md:text-[30px]">Choose your language</h1>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {languageChoices.map((choice) => {
                const active = language === choice.id;
                return (
                  <button
                    key={choice.id}
                    type="button"
                    dir={choice.id === "he" ? "rtl" : "ltr"}
                    aria-pressed={active}
                    onClick={() => chooseLanguage(choice.id)}
                    className={cn(
                      "flex min-h-16 items-center justify-center rounded-2xl border px-5 py-4 text-lg font-semibold transition-all duration-200",
                      active
                        ? "border-2 border-[#865BFF] bg-[linear-gradient(135deg,rgba(100,0,252,0.3),rgba(223,63,143,0.18))] text-white"
                        : "border-white/12 bg-white/[0.04] text-white hover:-translate-y-0.5 hover:border-[#7655C9] hover:bg-white/8",
                    )}
                  >
                    {choice.label}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <QuestionLayout
            question={question}
            index={step}
            total={questionnaire.length}
            progressLabel={fill(copy.questionOf, { current: step + 1, total: questionnaire.length })}
            title={questionCopy.title}
            subtitle={questionCopy.subtitle}
            selectionText={selectionText}
            rtl={rtl}
          >
            <div
              className={
                question.layout === "detailed"
                  ? "grid auto-rows-fr items-stretch gap-3 md:grid-cols-2 xl:grid-cols-3"
                  : "grid auto-rows-fr items-stretch gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              }
            >
              {question.options.map((option) => {
                const optionCopy = optionText(copy, question.id, option.value);
                return (
                  <div key={option.value} className="h-full">
                    <AnswerCard
                      label={optionCopy?.label ?? option.label}
                      description={optionCopy?.description}
                      selected={selected.includes(option.value)}
                      detailed={question.layout === "detailed"}
                      onToggle={() => {
                        const result = toggleOption(question.id, option.value);
                        if (result.blocked && max) toast(fill(copy.maxToast, { max }));
                        setShowError(false);
                      }}
                    />
                    {option.isOther && otherOption && selected.includes(otherOption.value) ? (
                      <div className="mt-3">
                        <OtherInput
                          value={otherText}
                          placeholder={copy.otherPlaceholder}
                          onChange={(value) => setOtherText(question.id, value)}
                        />
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </QuestionLayout>
        )}
      </div>
      <div className="fixed inset-x-0 bottom-0 z-20 bg-[rgba(32,13,86,0.92)] px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-[760px] items-center justify-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              if (stage === "language") {
                navigate("/");
                return;
              }
              if (step > 0) setStep((value) => value - 1);
              else setStage("language");
            }}
            className="btn-secondary h-11 min-h-11 min-w-44 !rounded-full border-white/14 bg-transparent px-10 text-white hover:bg-white/5"
          >
            {copy.back}
          </Button>
          <Button
            type="button"
            onClick={stage === "language" ? beginQuestions : goNext}
            disabled={submitting || (stage === "language" && !language)}
            className="btn-primary h-11 min-h-11 min-w-44 !rounded-full px-10 text-base font-semibold text-white"
          >
            {stage === "language"
              ? copy.continue
              : submitting
                ? copy.submitting
                : isLast
                  ? copy.submit
                  : copy.continue}
          </Button>
        </div>
        {stage === "questions" && showError ? (
          <p className="mx-auto mt-2 max-w-[760px] text-center text-sm text-[#FF6B81]">{copy.pleaseChoose}</p>
        ) : null}
      </div>
    </div>
  );
}
