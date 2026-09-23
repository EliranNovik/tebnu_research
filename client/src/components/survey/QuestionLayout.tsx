import type { ReactNode } from "react";
import { CircleHelp, Search, ShieldCheck, Sparkles, UsersRound } from "lucide-react";
import type { QuestionConfig } from "@/data/questionnaire";
import { ProgressHeader } from "./ProgressHeader";

const icons = {
  sparkles: Sparkles,
  search: Search,
  users: UsersRound,
  shield: ShieldCheck,
  help: CircleHelp,
};

type QuestionLayoutProps = {
  question: QuestionConfig;
  index: number;
  total: number;
  selectedCount: number;
  children: ReactNode;
};

export function QuestionLayout({
  question,
  index,
  total,
  selectedCount,
  children,
}: QuestionLayoutProps) {
  const Icon = icons[question.icon];
  const max = question.maxSelections;

  return (
    <div className="question-enter mx-auto w-full">
      <ProgressHeader current={index + 1} total={total} />
      <div className="mb-6 flex items-start gap-3">
        <div className="mt-1 flex size-10 shrink-0 items-center justify-center rounded-2xl bg-white/6 text-[#A993EB]">
          <Icon className="size-5" />
        </div>
        <div>
          <h1 className="text-[26px] font-bold leading-tight text-white md:text-[30px]">{question.title}</h1>
          {question.subtitle ? (
            <p className="mt-2 text-sm text-[#D9D2EC]">
              {question.subtitle}
              {max ? (
                <span className="ml-2 text-[#A993EB]">
                  {selectedCount >= max ? `${max} of ${max} selected` : `${selectedCount} selected`}
                </span>
              ) : null}
            </p>
          ) : null}
        </div>
      </div>
      {children}
    </div>
  );
}
