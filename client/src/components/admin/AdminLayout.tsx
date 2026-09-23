import { FilterBar } from "@/components/admin/FilterBar";
import { TebnuLogo } from "@/components/brand/TebnuLogo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useAdminLive } from "@/hooks/useAdminLive";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  HeartHandshake,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareText,
  Search,
  ShieldCheck,
  Table2,
} from "lucide-react";
import { Navigate, NavLink, Outlet, useLocation } from "react-router-dom";

const links = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/responses", label: "Responses", icon: Table2 },
  { to: "/admin/categories", label: "Categories", icon: HeartHandshake },
  { to: "/admin/behavior", label: "Behavior", icon: Search },
  { to: "/admin/discovery", label: "Discovery", icon: BarChart3 },
  { to: "/admin/trust", label: "Trust", icon: ShieldCheck },
  { to: "/admin/barriers", label: "Barriers", icon: MessageSquareText },
  { to: "/admin/other", label: "Other answers", icon: MessageSquareText },
];

function NavItems({ onClick }: { onClick?: () => void }) {
  const { logout } = useAdminAuth();
  return (
    <div className="flex h-full flex-col">
      <TebnuLogo className="mb-8 px-2" />
      <nav className="flex flex-1 flex-col gap-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            onClick={onClick}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/75 transition-colors",
                isActive && "bg-[#351A7A] text-white",
              )
            }
          >
            <link.icon className="size-4" />
            {link.label}
          </NavLink>
        ))}
      </nav>
      <Button
        variant="ghost"
        className="mt-4 justify-start text-white/75 hover:bg-[#351A7A] hover:text-white"
        onClick={() => void logout()}
      >
        <LogOut className="size-4" />
        Logout
      </Button>
    </div>
  );
}

export function AdminLayout() {
  const { user, loading, configured } = useAdminAuth();
  const location = useLocation();
  useAdminLive();

  if (loading) {
    return <div className="admin-root flex min-h-svh items-center justify-center text-[#6B6280]">Loading...</div>;
  }

  if (configured && !user) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  return (
    <div className="admin-root min-h-svh bg-[#F7F7FA] text-[#1A1430]">
      <aside className="fixed inset-y-0 left-0 hidden w-64 bg-[#200D56] p-5 lg:block">
        <NavItems />
      </aside>
      <div className="lg:pl-64">
        <header className="flex items-center justify-between border-b border-[#ECECF2] bg-white px-4 py-3 lg:hidden">
          <p className="font-semibold">Tebnu Admin</p>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-[#200D56] text-white">
              <NavItems />
            </SheetContent>
          </Sheet>
        </header>
        <main className="p-4 md:p-8">
          <FilterBar />
          <Outlet />
        </main>
      </div>
    </div>
  );
}
