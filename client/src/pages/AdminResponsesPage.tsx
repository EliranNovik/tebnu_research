import { ResponsesTable } from "@/components/admin/ResponsesTable";
import { Skeleton } from "@/components/ui/skeleton";
import { adminApi, useAdminQuery } from "@/hooks/useAdminQuery";
import { useCallback } from "react";

export function AdminResponsesPage() {
  const loader = useCallback(adminApi.responses, []);
  const { data, loading, error } = useAdminQuery(loader);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Responses</h1>
        <p className="text-sm text-[#6B6280]">Every submitted questionnaire, stored as one complete document.</p>
      </div>
      {loading ? <Skeleton className="h-96 w-full rounded-2xl" /> : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {data ? <ResponsesTable items={data.items} page={data.page} total={data.total} limit={data.limit} /> : null}
    </div>
  );
}
