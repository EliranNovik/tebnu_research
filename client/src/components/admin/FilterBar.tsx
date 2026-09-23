import { questionnaire } from "@/data/questionnaire";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "react-router-dom";

const presets = [
  { value: "all", label: "All time" },
  { value: "today", label: "Today" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "custom", label: "Custom range" },
];

function isoDate(date: Date) {
  return date.toISOString();
}

function rangeForPreset(preset: string) {
  const now = new Date();
  if (preset === "today") {
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    return { from: isoDate(start), to: isoDate(now) };
  }
  if (preset === "7d") {
    const start = new Date(now);
    start.setDate(start.getDate() - 7);
    return { from: isoDate(start), to: isoDate(now) };
  }
  if (preset === "30d") {
    const start = new Date(now);
    start.setDate(start.getDate() - 30);
    return { from: isoDate(start), to: isoDate(now) };
  }
  return { from: undefined, to: undefined };
}

export function FilterBar() {
  const [params, setParams] = useSearchParams();
  const preset = params.get("preset") ?? "all";
  const category = params.get("category") ?? "all";
  const categories = questionnaire[0]!.options.filter((option) => !option.exclusive);

  function update(next: Record<string, string | undefined>) {
    const copy = new URLSearchParams(params);
    Object.entries(next).forEach(([key, value]) => {
      if (!value || value === "all") copy.delete(key);
      else copy.set(key, value);
    });
    copy.delete("page");
    setParams(copy);
  }

  return (
    <div className="mb-6 grid gap-3 rounded-2xl border border-[#ECECF2] bg-white p-4 md:grid-cols-4">
      <div className="space-y-2">
        <Label>Date</Label>
        <Select
          value={preset}
          onValueChange={(value) => {
            const range = rangeForPreset(value);
            update({ preset: value, from: range.from, to: range.to });
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {presets.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Category</Label>
        <Select value={category} onValueChange={(value) => update({ category: value })}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {categories.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {preset === "custom" ? (
        <>
          <div className="space-y-2">
            <Label>From</Label>
            <Input
              type="date"
              value={params.get("from")?.slice(0, 10) ?? ""}
              onChange={(event) => update({ preset: "custom", from: event.target.value ? new Date(event.target.value).toISOString() : undefined })}
            />
          </div>
          <div className="space-y-2">
            <Label>To</Label>
            <Input
              type="date"
              value={params.get("to")?.slice(0, 10) ?? ""}
              onChange={(event) => update({ preset: "custom", to: event.target.value ? new Date(`${event.target.value}T23:59:59`).toISOString() : undefined })}
            />
          </div>
        </>
      ) : null}
    </div>
  );
}

export function useAdminFilters() {
  const [params] = useSearchParams();
  return {
    from: params.get("from") ?? undefined,
    to: params.get("to") ?? undefined,
    category: params.get("category") ?? undefined,
    page: params.get("page") ?? undefined,
    limit: params.get("limit") ?? undefined,
  };
}
