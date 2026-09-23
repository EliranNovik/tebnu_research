import { AnalyticsCard } from "@/components/admin/AnalyticsCard";
import { AnalyticsChart } from "@/components/admin/AnalyticsChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { adminApi, useAdminQuery } from "@/hooks/useAdminQuery";
import { BarChart3, CheckCircle2, HeartHandshake, ShieldCheck, TriangleAlert, Users } from "lucide-react";
import { useCallback } from "react";

export function AdminDashboardPage() {
  const loader = useCallback(adminApi.overview, []);
  const categoriesLoader = useCallback(adminApi.categories, []);
  const { data, loading, error } = useAdminQuery(loader);
  const categories = useAdminQuery(categoriesLoader);

  if (loading) return <DashboardSkeleton />;
  if (error || !data) return <p className="text-sm text-red-600">{error ?? "Unable to load overview"}</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Overview</h1>
        <p className="text-sm text-[#6B6280]">Completion and the strongest signals from the questionnaire.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <AnalyticsCard label="Total responses" value={String(data.totalResponses)} icon={Users} />
        <AnalyticsCard
          label="Completion rate"
          value={`${data.completionRate}%`}
          hint={`Started ${data.started} · Completed ${data.completed}`}
          icon={CheckCircle2}
        />
        <AnalyticsCard
          label="Start rate"
          value={`${data.startRate}%`}
          hint={`${data.landingViews} landing views`}
          icon={BarChart3}
        />
        <AnalyticsCard label="Most selected category" value={data.topCategory?.label ?? "—"} icon={HeartHandshake} />
        <AnalyticsCard label="Most popular discovery" value={data.topDiscovery?.label ?? "—"} icon={BarChart3} />
        <AnalyticsCard label="Top trust factor" value={data.topTrust?.label ?? "—"} icon={ShieldCheck} />
        <AnalyticsCard label="Top barrier" value={data.topBarrier?.label ?? "—"} icon={TriangleAlert} />
      </div>
      <Card className="rounded-3xl border-white bg-white shadow-[0_12px_32px_rgba(32,13,86,0.06)]">
        <CardHeader>
          <CardTitle>Question drop-off</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-5">
          {data.dropOff.map((item) => (
            <div key={item.questionId} className="rounded-2xl bg-[#F7F7FA] px-4 py-5">
              <p className="text-xs font-medium uppercase tracking-wide text-[#6B6280]">{item.questionId}</p>
              <p className="mt-2 text-3xl font-bold tracking-tight">{item.views}</p>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card className="rounded-3xl border-white bg-white shadow-[0_12px_32px_rgba(32,13,86,0.06)]">
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent>
          {categories.data ? <AnalyticsChart items={categories.data.items} /> : <Skeleton className="h-64 w-full" />}
        </CardContent>
      </Card>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <Skeleton key={index} className="h-32 rounded-2xl" />
      ))}
    </div>
  );
}
