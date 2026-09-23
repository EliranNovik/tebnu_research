import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

type AnswerCardProps = {
  label: string;
  description?: string;
  selected: boolean;
  onToggle: () => void;
  detailed?: boolean;
};

export function AnswerCard({ label, description, selected, onToggle, detailed }: AnswerCardProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={selected}
      className={cn(
        "group flex h-full w-full items-center gap-3 rounded-2xl border-2 px-[18px] py-4 text-start transition-all duration-200",
        detailed ? "min-h-[148px] items-start px-5 py-[18px]" : "min-h-[108px]",
        selected
          ? "border-[#865BFF] bg-[linear-gradient(135deg,rgba(100,0,252,0.3),rgba(223,63,143,0.18))]"
          : "border-white/12 bg-white/[0.04] hover:-translate-y-0.5 hover:border-[#7655C9] hover:bg-white/8",
      )}
    >
      <span
        className={cn(
          "flex size-6 shrink-0 items-center justify-center rounded-full border transition-all duration-200",
          detailed && "mt-0.5",
          selected ? "border-[#865BFF] bg-[#865BFF] text-white" : "border-white/25 text-transparent",
        )}
      >
        <Check className={cn("size-3.5 transition-transform duration-200", selected ? "scale-100" : "scale-75")} />
      </span>
      <span className="min-w-0">
        <span className="block text-[18px] font-medium leading-snug text-white">{label}</span>
        {description ? (
          <span className="mt-1 block text-[15px] leading-relaxed text-[#A993EB]">{description}</span>
        ) : null}
      </span>
    </button>
  );
}
