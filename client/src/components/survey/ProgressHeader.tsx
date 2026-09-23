import { Progress } from "@/components/ui/progress";

type ProgressHeaderProps = {
  current: number;
  total: number;
};

export function ProgressHeader({ current, total }: ProgressHeaderProps) {
  const value = (current / total) * 100;

  return (
    <div className="mb-8">
      <p className="mb-3 text-base font-medium tracking-wide text-[#A993EB]">
        Question {current} of {total}
      </p>
      <Progress
        value={value}
        className="h-2 bg-white/10 [&>[data-slot=progress-indicator]]:bg-[linear-gradient(90deg,#6400FC,#DF3F8F)]"
      />
    </div>
  );
}
