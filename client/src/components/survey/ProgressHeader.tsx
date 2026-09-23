import { Progress } from "@/components/ui/progress";

type ProgressHeaderProps = {
  label: string;
  current: number;
  total: number;
  rtl?: boolean;
};

export function ProgressHeader({ label, current, total, rtl = false }: ProgressHeaderProps) {
  const value = (current / total) * 100;

  return (
    <div className="mb-8">
      <p className="mb-3 text-base font-medium tracking-wide text-[#A993EB]">{label}</p>
      <Progress
        value={value}
        rtl={rtl}
        className={
          rtl
            ? "h-2 bg-white/10 [&>[data-slot=progress-indicator]]:bg-[linear-gradient(to_left,#6400FC,#DF3F8F)]"
            : "h-2 bg-white/10 [&>[data-slot=progress-indicator]]:bg-[linear-gradient(90deg,#6400FC,#DF3F8F)]"
        }
      />
    </div>
  );
}
