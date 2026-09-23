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
  progressLabel: string;
  title: string;
  subtitle?: string;
  selectionText?: string;
  rtl?: boolean;
  children: ReactNode;
};

export function QuestionLayout({
  question,
  index,
  total,
  progressLabel,
  title,
  subtitle,
  selectionText,
  rtl = false,
  children,
}: QuestionLayoutProps) {
  const Icon = icons[question.icon];

  return (
    <div className="question-enter mx-auto w-full">
      <ProgressHeader label={progressLabel} current={index + 1} total={total} rtl={rtl} />
      <div className="mb-10 flex items-start gap-3">
        <div className="mt-1 flex size-10 shrink-0 items-center justify-center rounded-2xl bg-white/6 text-[#A993EB]">
          <Icon className="size-5" />
        </div>
        <div>
          <h1 className="text-[26px] font-bold leading-tight text-white md:text-[30px]">{title}</h1>
          {subtitle ? (
            <p className="mt-2 text-sm text-[#D9D2EC]">
              {subtitle}
              {selectionText ? <span className="ms-2 text-[#A993EB]">{selectionText}</span> : null}
            </p>
          ) : null}
        </div>
      </div>
      {children}
    </div>
  );
}
