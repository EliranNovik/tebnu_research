import type { NextFunction, Request, Response } from "express";
import { getSupabase, isSupabaseConfigured } from "../services/supabase";

export type AdminRequest = Request & {
  adminUid?: string;
};

export async function requireAdmin(req: AdminRequest, res: Response, next: NextFunction) {
  if (!isSupabaseConfigured() && process.env.NODE_ENV !== "production") {
    req.adminUid = "local-demo";
    next();
    return;
  }

  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      res.status(401).json({ error: "Missing authentication token" });
      return;
    }

    const token = header.slice("Bearer ".length);
    const { data, error } = await getSupabase().auth.getUser(token);
    if (error || !data.user) {
      res.status(401).json({ error: "Invalid or expired authentication token" });
      return;
    }

    const adminResult = await getSupabase()
      .from("admins")
      .select("role, active")
      .eq("id", data.user.id)
      .maybeSingle();

    const admin = adminResult.data;
    if (adminResult.error || !admin || admin.role !== "admin" || admin.active !== true) {
      res.status(403).json({ error: "Admin access required" });
      return;
    }

    req.adminUid = data.user.id;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired authentication token" });
  }
}
