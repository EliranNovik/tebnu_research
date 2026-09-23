import { useAdminFilters } from "@/components/admin/FilterBar";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { fetchShared, getRevision, queryCacheKey, readCache, watchQuery, writeCache } from "@/services/adminCache";
import { adminApi, type AdminQueryLoader } from "@/services/api";
import { useEffect, useState } from "react";

export function useAdminQuery<T>(loader: AdminQueryLoader<T>) {
  const { getToken } = useAdminAuth();
  const filters = useAdminFilters();
  const key = queryCacheKey(loader.queryKey, filters);
  const initial = readCache<T>(key);
  const [data, setData] = useState<T | null>(initial?.data ?? null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(initial == null);

  useEffect(() => {
    let cancelled = false;
    let attempt = 0;
    const cached = readCache<T>(key);
    if (cached) {
      setData(cached.data);
      setLoading(false);
      setError(null);
    } else {
      setLoading(true);
    }

    async function refresh() {
      const revision = getRevision();
      const current = readCache<T>(key);
      if (current && revision && current.revision === revision) return;

      const id = ++attempt;
      const stamp = revision ?? "pending";
      try {
        const token = (await getToken()) ?? "local-demo";
        const result = await fetchShared(`${key}@${stamp}`, () => loader(token, filters));
        if (cancelled || id !== attempt) return;
        const latest = getRevision();
        if (latest && latest !== stamp) return;
        writeCache(key, latest ?? stamp, result);
        setData(result);
        setError(null);
      } catch (err) {
        if (cancelled || id !== attempt) return;
        if (!readCache(key)) setError(err instanceof Error ? err.message : "Failed to load");
      } finally {
        if (!cancelled && id === attempt) setLoading(false);
      }
    }

    const revision = getRevision();
    if (!cached || (revision !== null && cached.revision !== revision)) void refresh();

    const stop = watchQuery(key, () => {
      void refresh();
    });

    return () => {
      cancelled = true;
      stop();
    };
  }, [filters.category, filters.from, filters.limit, filters.page, filters.to, getToken, key, loader]);

  return { data, error, loading };
}

export { adminApi };
export type { AdminFilters } from "@/services/api";
