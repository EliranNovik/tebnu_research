import type { AdminFilters } from "@/services/api";

const STORAGE_KEY = "tebnu_admin_cache_v1";

type Entry = {
  revision: string;
  data: unknown;
};

type Store = {
  revision: string | null;
  entries: Record<string, Entry>;
};

const active = new Map<string, Set<() => void>>();
const inflight = new Map<string, Promise<unknown>>();

function emptyStore(): Store {
  return { revision: null, entries: {} };
}

function loadStore(): Store {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyStore();
    const parsed = JSON.parse(raw) as Store;
    if (!parsed?.entries || typeof parsed.entries !== "object") return emptyStore();
    return { revision: parsed.revision ?? null, entries: parsed.entries };
  } catch {
    return emptyStore();
  }
}

let state = loadStore();

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Memory cache still serves this tab if storage is full or blocked.
  }
}

export function getRevision() {
  return state.revision;
}

export function queryCacheKey(name: string, filters: AdminFilters) {
  return [name, filters.from ?? "", filters.to ?? "", filters.category ?? "", filters.page ?? "", filters.limit ?? ""].join("|");
}

export function readCache<T>(key: string) {
  const entry = state.entries[key];
  if (!entry) return null;
  return entry as { revision: string; data: T };
}

export function writeCache(key: string, revision: string, data: unknown) {
  state.entries[key] = { revision, data };
  persist();
}

export function watchQuery(key: string, refresh: () => void) {
  const listeners = active.get(key) ?? new Set<() => void>();
  listeners.add(refresh);
  active.set(key, listeners);
  return () => {
    listeners.delete(refresh);
    if (listeners.size === 0) active.delete(key);
  };
}

export function applyServerRevision(revision: string) {
  if (state.revision === revision) return;
  const previous = state.revision;
  state.revision = revision;

  if (previous === null) {
    for (const entry of Object.values(state.entries)) {
      if (entry.revision === "pending") entry.revision = revision;
    }
  }
  persist();

  for (const [key, listeners] of active) {
    if (previous === null && state.entries[key]?.revision === revision) continue;
    for (const refresh of listeners) refresh();
  }
}

export function fetchShared<T>(key: string, run: () => Promise<T>) {
  const existing = inflight.get(key) as Promise<T> | undefined;
  if (existing) return existing;
  const promise = run().finally(() => {
    if (inflight.get(key) === promise) inflight.delete(key);
  });
  inflight.set(key, promise);
  return promise;
}
