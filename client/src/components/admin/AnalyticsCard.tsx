import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

type AnalyticsCardProps = {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
  className?: string;
};

export function AnalyticsCard({ label, value, hint, icon: Icon, className }: AnalyticsCardProps) {
  return (
    <Card
      className={cn(
        "rounded-3xl border-white bg-white shadow-[0_12px_32px_rgba(32,13,86,0.06)]",
        className,
      )}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-medium text-[#6B6280]">{label}</p>
            <p className="mt-3 text-3xl font-bold tracking-tight text-[#1A1430]">{value}</p>
            {hint ? <p className="mt-2 text-sm text-[#6B6280]">{hint}</p> : null}
          </div>
          <Icon className="size-12 shrink-0 text-[#6400FC]" strokeWidth={2} />
        </div>
      </CardContent>
    </Card>
  );
}
