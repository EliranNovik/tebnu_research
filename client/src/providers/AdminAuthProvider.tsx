import { getSupabase, isSupabaseConfigured } from "@/services/supabase";
import type { Session } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type AdminUser = {
  id: string;
  email: string | null;
};

type AdminAuthContextValue = {
  user: AdminUser | null;
  loading: boolean;
  configured: boolean;
  login: (email: string, password: string) => Promise<unknown>;
  logout: () => Promise<void>;
  getToken: () => Promise<string | null>;
};

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

function toUser(session: Session | null): AdminUser | null {
  if (!session?.user) return null;
  return { id: session.user.id, email: session.user.email ?? null };
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const configured = isSupabaseConfigured();

  useEffect(() => {
    if (!configured) {
      setLoading(false);
      return;
    }

    const supabase = getSupabase();
    void supabase.auth.getSession().then(({ data }) => {
      setUser(toUser(data.session));
      setLoading(false);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(toUser(session));
      setLoading(false);
    });

    return () => data.subscription.unsubscribe();
  }, [configured]);

  const value = useMemo<AdminAuthContextValue>(
    () => ({
      user,
      loading,
      configured,
      login: async (email, password) => {
        const { error } = await getSupabase().auth.signInWithPassword({ email, password });
        if (error) throw error;
      },
      logout: async () => {
        if (configured) await getSupabase().auth.signOut();
      },
      getToken: async () => {
        if (!configured) return null;
        const { data } = await getSupabase().auth.getSession();
        return data.session?.access_token ?? null;
      },
    }),
    [configured, loading, user],
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
