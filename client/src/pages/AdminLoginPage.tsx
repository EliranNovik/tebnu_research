import { TebnuLogo } from "@/components/brand/TebnuLogo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useState, type FormEvent } from "react";
import { Navigate } from "react-router-dom";

export function AdminLoginPage() {
  const { login, user, loading, configured } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!loading && (user || !configured)) return <Navigate to="/admin" replace />;

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await login(email, password);
    } catch {
      setError("Could not sign in. Check your email, password, and admin access.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="survey-shell flex min-h-svh items-center justify-center px-4">
      <Card className="survey-panel w-full max-w-md border-white/10 bg-transparent text-white shadow-none">
        <CardHeader>
          <TebnuLogo large className="mb-5" />
          <CardTitle className="text-2xl">Admin login</CardTitle>
        </CardHeader>
        <CardContent>
          {!configured ? (
            <p className="text-sm text-[#FF6B81]">
              Supabase configuration is missing. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to client/.env.
            </p>
          ) : (
            <form className="space-y-4" onSubmit={onSubmit}>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </div>
              {error ? <p className="text-sm text-[#FF6B81]">{error}</p> : null}
              <Button type="submit" disabled={submitting} className="btn-primary h-12 w-full text-white">
                {submitting ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
