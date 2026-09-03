import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { GranaryWordmark } from "@/client/components/brand/logo";
import { ThemeToggle } from "@/client/components/effects/theme-toggle";
import { LocaleToggle } from "@/client/components/effects/locale-toggle";
import { useGranary } from "@/shared/store";
import { tons } from "@/client/format";
import { cn } from "@/client/cn";
import { LogIn, LogOut, User, ChevronDown } from "lucide-react";
import { farmers, operators } from "@/server/seed";
import { authClient } from "@/shared/auth/client";
export function SiteHeader() {
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const lots = useGranary((s) => s.lots);
  const role = useGranary((s) => s.role);
  const farmerId = useGranary((s) => s.farmerId);
  const operatorId = useGranary((s) => s.operatorId);
  const farmersList = useGranary((s) => s.farmersList);
  const operatorsList = useGranary((s) => s.operatorsList);
  const isAuthenticated = useGranary((s) => s.isAuthenticated);
  const logout = useGranary((s) => s.logout);

  const activeFarmer = farmersList.find((f) => f.id === farmerId);
  const activeOperator = operatorsList.find((o) => o.id === operatorId);
  
  // Use session name if available (from Better Auth), else fallback to profile name, else generic
  const { data: session } = authClient.useSession();
  const sessionName = session?.user?.name;
  const activeUser = sessionName || (role === "farmer" ? activeFarmer?.name : activeOperator?.name) || "User";

  const mine = lots.filter((l) => l.farmerId === farmerId && l.status !== "released");
  const stored = mine.reduce((n, l) => n + l.tons, 0);

  // Treat Home (/) and Login (/login) as entry pages with NO desk/yard tabs shown
  const isEntryPage = path === "/" || path.startsWith("/login");
  const onDesk = path.startsWith("/farmer") || path.startsWith("/operator");

  const handleLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

  return (
    <header className="sticky top-0 z-[9999] border-b border-border/70 bg-card/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-3 px-4 md:px-6">
        <Link to="/" className="shrink-0">
          <GranaryWordmark />
        </Link>

        {/* HEADER NAVIGATION - Hides Home tab when user is logged in */}
        <nav className="ml-2 hidden items-center gap-1 md:flex">
          {!isAuthenticated && (
            <NavLink to="/" active={path === "/"}>
              Home
            </NavLink>
          )}
          {isAuthenticated && role === "farmer" && (
            <NavLink to="/farmer" active={path.startsWith("/farmer")}>
              Farmer desk
            </NavLink>
          )}
          {isAuthenticated && role === "operator" && (
            <NavLink to="/operator" active={path.startsWith("/operator")}>
              Warehouse
            </NavLink>
          )}
          {!isAuthenticated && (
            <NavLink to="/login" active={path.startsWith("/login")}>
              Login Portal
            </NavLink>
          )}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {isAuthenticated && onDesk && mine.length > 0 && role === "farmer" && (
            <div className="hidden items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-[12px] text-muted-foreground sm:flex">
              <span className="size-1.5 rounded-full bg-pin-mine" />
              <span className="tabular-nums text-foreground">{mine.length} lots</span>
              <span className="tabular-nums">{tons(stored)}</span>
            </div>
          )}

          {/* USER PROFILE CARD - NON-CLICKABLE (DROPS DOWN LOG OUT ON HOVER ONLY) */}
          {isAuthenticated ? (
            <div className="group relative">
              <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-800 dark:text-emerald-300 transition-all cursor-default select-none">
                <User className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="max-w-[110px] truncate">{activeUser}</span>
                <span className="text-[10px] uppercase opacity-75 font-mono">({role})</span>
                <ChevronDown className="size-3 opacity-60 group-hover:rotate-180 transition-transform" />
              </div>

              {/* HOVER DROPDOWN WITH LOG OUT BUTTON */}
              <div className="absolute right-0 top-full pt-1.5 hidden group-hover:block z-50">
                <div className="w-48 rounded-2xl border border-border bg-card/95 p-2 shadow-2xl backdrop-blur-md">
                  <div className="px-2.5 py-1.5 border-b border-border/60">
                    <p className="text-[11px] font-medium text-muted-foreground">Active User</p>
                    <p className="text-xs font-semibold text-foreground truncate mt-0.5">{activeUser}</p>
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono capitalize">
                      {role === "farmer" ? "Farmer Account" : "Warehouse Owner"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-1.5 flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <LogOut className="size-3.5" />
                    Log Out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-700 hover:bg-emerald-600 text-white px-3.5 py-1.5 text-xs font-medium transition-colors shadow-sm"
            >
              <LogIn className="size-3.5" />
              <span>Sign In / Register</span>
            </Link>
          )}

          {!isEntryPage && role === "farmer" && (
            <Link
              to="/farmer"
              className={cn(
                "rounded-full px-3 py-2 text-[13px] font-medium md:hidden",
                path.startsWith("/farmer") ? "bg-muted text-foreground" : "text-muted-foreground",
              )}
            >
              Desk
            </Link>
          )}
          {!isEntryPage && role === "operator" && (
            <Link
              to="/operator"
              className={cn(
                "rounded-full px-3 py-2 text-[13px] font-medium md:hidden",
                path.startsWith("/operator") ? "bg-muted text-foreground" : "text-muted-foreground",
              )}
            >
              Yard
            </Link>
          )}
          <LocaleToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

function NavLink({
  to,
  active,
  children,
}: {
  to: "/" | "/farmer" | "/operator" | "/login";
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className={cn(
        "rounded-full px-3.5 py-2 text-[13px] font-medium transition-[background-color,color] duration-150",
        active ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </Link>
  );
}
