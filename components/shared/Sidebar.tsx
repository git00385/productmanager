"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Map,
  FileText,
  BarChart2,
  FlaskConical,
  Calendar,
  Megaphone,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import { NAV_ITEMS } from "@/config/nav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Logo from "@/components/Logo";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Map,
  FileText,
  BarChart2,
  FlaskConical,
  Calendar,
  Megaphone,
};

/** Responsive collapsible sidebar with nav links and user section. */
export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar, user } = useAppStore();

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase()
    : "U";

  return (
    <aside
      className={cn(
        "flex flex-col h-screen bg-sidebar-bg border-r border-sidebar-border transition-all duration-200 shrink-0",
        sidebarOpen ? "w-60" : "w-16"
      )}
    >
      {/* Logo */}
      <div className={cn("flex items-center gap-3 px-4 h-14 border-b border-sidebar-border shrink-0", !sidebarOpen && "justify-center px-0")}>
        <Logo size={28} />
        {sidebarOpen && (
          <span className="text-sm font-semibold tracking-tight text-foreground">PM Agent</span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-0.5 px-2">
          {NAV_ITEMS.filter((item) => !item.disabled).map((item) => {
            const Icon = ICON_MAP[item.icon];
            const isActive = pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-2 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                    !sidebarOpen && "justify-center px-2"
                  )}
                  title={!sidebarOpen ? item.label : undefined}
                >
                  {Icon && <Icon className="h-4 w-4 shrink-0" />}
                  {sidebarOpen && <span>{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom: user + settings */}
      <div className={cn("border-t border-sidebar-border p-3 space-y-1", !sidebarOpen && "px-2")}>
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 rounded-lg px-2 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors",
            !sidebarOpen && "justify-center"
          )}
          title={!sidebarOpen ? "Settings" : undefined}
        >
          <Settings className="h-4 w-4 shrink-0" />
          {sidebarOpen && <span>Settings</span>}
        </Link>

        {sidebarOpen && (
          <div className="flex items-center gap-2 px-2 py-2 rounded-lg">
            <Avatar className="h-7 w-7">
              <AvatarImage src={user?.avatarUrl ?? ""} alt={user?.name ?? "User"} />
              <AvatarFallback className="text-xs">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{user?.name ?? "User"}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email ?? ""}</p>
            </div>
          </div>
        )}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={toggleSidebar}
        className="absolute left-56 top-5 hidden lg:flex items-center justify-center h-5 w-5 rounded-full border border-border bg-card text-muted-foreground hover:text-foreground transition-all"
        style={{ left: sidebarOpen ? "228px" : "52px" }}
        aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
      >
        {sidebarOpen ? <ChevronLeft className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
      </button>
    </aside>
  );
}
