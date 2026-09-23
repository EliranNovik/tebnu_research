import { AdminAuthProvider } from "@/providers/AdminAuthProvider";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";

export function AdminShell() {
  return (
    <AdminAuthProvider>
      <Suspense fallback={<div className="flex min-h-svh items-center justify-center text-sm">Loading...</div>}>
        <Outlet />
      </Suspense>
    </AdminAuthProvider>
  );
}
