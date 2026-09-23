import type { AnalyticsItem } from "@/types/survey";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const COLORS = ["#6400FC", "#DF3F8F", "#7655C9", "#34BFA3", "#4B8DF8", "#F4A340"];

type AnalyticsChartProps = {
  items: AnalyticsItem[];
  emptyLabel?: string;
};

export function AnalyticsChart({ items, emptyLabel = "No responses yet" }: AnalyticsChartProps) {
  const data = items.filter((item) => item.key !== "other" || item.count > 0);

  if (data.length === 0) {
    return <p className="py-10 text-center text-sm text-[#6B6280]">{emptyLabel}</p>;
  }

  return (
    <div className="h-[max(280px,calc(data.length*36px))] min-h-[320px] w-full">
      <ResponsiveContainer width="100%" height={Math.max(320, data.length * 42)}>
        <BarChart data={data} layout="vertical" margin={{ left: 8, right: 24, top: 8, bottom: 8 }}>
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="label"
            width={170}
            tick={{ fill: "#4A4460", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: "rgba(100,0,252,0.05)" }}
            content={({ payload }) => {
              const item = payload?.[0]?.payload as AnalyticsItem | undefined;
              if (!item) return null;
              return (
                <div className="rounded-xl border border-[#ECECF2] bg-white px-3 py-2 text-sm shadow-sm">
                  <p className="font-semibold">{item.label}</p>
                  <p className="text-[#6B6280]">
                    {item.count} respondents · {item.percentage}%
                  </p>
                </div>
              );
            }}
          />
          <Bar dataKey="count" radius={[0, 8, 8, 0]} fill={COLORS[0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function AnalyticsLegend({ items }: { items: AnalyticsItem[] }) {
  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={item.key} className="flex items-center justify-between gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full" style={{ background: COLORS[index % COLORS.length] }} />
            <span className="text-[#1A1430]">{item.label}</span>
          </div>
          <span className="text-[#6B6280]">
            {item.count} · {item.percentage}%
          </span>
        </div>
      ))}
    </div>
  );
}
