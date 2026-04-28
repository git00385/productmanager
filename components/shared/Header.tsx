"use client";

import { Bell, Search, Menu } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  /** Current page title shown as breadcrumb. */
  title: string;
}

/** Top navigation bar with breadcrumb, search, and notifications. */
export function Header({ title }: HeaderProps) {
  const toggleSidebar = useAppStore((s) => s.toggleSidebar);

  return (
    <header className="flex items-center gap-4 h-14 px-4 border-b border-border bg-background/80 backdrop-blur-sm shrink-0">
      {/* Mobile sidebar toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={toggleSidebar}
        aria-label="Toggle menu"
      >
        <Menu className="h-4 w-4" />
      </Button>

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">PM Agent</span>
        <span className="text-muted-foreground">/</span>
        <span className="font-medium text-foreground">{title}</span>
      </div>

      <div className="flex-1" />

      {/* Search */}
      <div className="relative hidden md:block w-56">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          placeholder="Search…"
          className="pl-8 h-8 text-xs bg-secondary border-transparent focus-visible:border-ring"
        />
      </div>

      {/* Notifications */}
      <Button variant="ghost" size="icon" aria-label="Notifications">
        <Bell className="h-4 w-4" />
      </Button>
    </header>
  );
}
