import { AnalyticsChart, AnalyticsLegend } from "@/components/admin/AnalyticsChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { adminApi, useAdminQuery } from "@/hooks/useAdminQuery";
import type { AdminQueryLoader } from "@/services/api";
import type { AnalyticsResponse } from "@/types/survey";
import { useCallback, useMemo, useState } from "react";

type SortMode = "most" | "least" | "alpha";

type AdminAnalyticsPageProps = {
  title: string;
  description: string;
  loader: AdminQueryLoader<AnalyticsResponse>;
  allowSort?: boolean;
};

export function AdminAnalyticsPage({ title, description, loader, allowSort }: AdminAnalyticsPageProps) {
  const queryLoader = useCallback(loader, [loader]);
  const { data, loading, error } = useAdminQuery(queryLoader);
  const [sort, setSort] = useState<SortMode>("most");

  const items = useMemo(() => {
    if (!data) return [];
    const next = [...data.items];
    if (sort === "most") next.sort((a, b) => b.count - a.count);
    if (sort === "least") next.sort((a, b) => a.count - b.count);
    if (sort === "alpha") next.sort((a, b) => a.label.localeCompare(b.label));
    return next;
  }, [data, sort]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-sm text-[#6B6280]">{description}</p>
        </div>
        {allowSort ? (
          <Select value={sort} onValueChange={(value) => setSort(value as SortMode)}>
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="most">Most selected</SelectItem>
              <SelectItem value="least">Least selected</SelectItem>
              <SelectItem value="alpha">Alphabetical</SelectItem>
            </SelectContent>
          </Select>
        ) : null}
      </div>
      <Card className="rounded-2xl border-[#ECECF2] shadow-none">
        <CardHeader>
          <CardTitle>{data ? `${data.totalResponses} respondents` : "Loading"}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          {loading ? <Skeleton className="h-80 w-full" /> : null}
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          {!loading && data ? (
            <>
              <AnalyticsChart items={items} />
              <AnalyticsLegend items={items} />
            </>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

export function AdminCategoriesPage() {
  return (
    <AdminAnalyticsPage
      title="Categories"
      description="Share of respondents who selected each kind of help."
      loader={adminApi.categories}
    />
  );
}

export function AdminBehaviorPage() {
  return (
    <AdminAnalyticsPage
      title="Current behavior"
      description="Where people currently look when they need everyday help."
      loader={adminApi.currentMethod}
    />
  );
}

export function AdminDiscoveryPage() {
  return (
    <AdminAnalyticsPage
      title="Preferred discovery"
      description="Which Tebnu-style discovery experiences people actually prefer."
      loader={adminApi.discovery}
    />
  );
}

export function AdminTrustPage() {
  return (
    <AdminAnalyticsPage
      title="Trust"
      description="What would make someone trust a helper enough to hire them."
      loader={adminApi.trust}
      allowSort
    />
  );
}

export function AdminBarriersPage() {
  return (
    <AdminAnalyticsPage
      title="Barriers"
      description="The biggest reasons people sometimes don't ask for help."
      loader={adminApi.barriers}
    />
  );
}
