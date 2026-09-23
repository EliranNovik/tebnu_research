import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { adminApi, useAdminQuery } from "@/hooks/useAdminQuery";
import { useCallback } from "react";

const sections = [
  { key: "categories", title: "Question 1 — Categories" },
  { key: "currentMethod", title: "Question 2 — Current method" },
  { key: "preferredDiscovery", title: "Question 3 — Preferred discovery" },
  { key: "trustFactors", title: "Question 4 — Trust" },
  { key: "barriers", title: "Question 5 — Barriers" },
] as const;

export function AdminOtherPage() {
  const loader = useCallback(adminApi.other, []);
  const { data, loading, error } = useAdminQuery(loader);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Other answers</h1>
        <p className="text-sm text-[#6B6280]">Free-text answers, kept separate by question.</p>
      </div>
      {loading ? <Skeleton className="h-80 w-full rounded-2xl" /> : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {data
        ? sections.map((section) => (
            <Card key={section.key} className="rounded-2xl border-[#ECECF2] shadow-none">
              <CardHeader>
                <CardTitle>
                  {section.title} · {data[section.key].length}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {data[section.key].length === 0 ? (
                  <p className="text-sm text-[#6B6280]">No free-text answers yet.</p>
                ) : (
                  <ul className="space-y-2">
                    {data[section.key].map((item, index) => (
                      <li key={`${section.key}-${index}`} className="rounded-xl bg-[#F7F7FA] px-4 py-3 text-sm">
                        “{item}”
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          ))
        : null}
    </div>
  );
}
