"use client";

import { APP_NAME } from "@/lib/config";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Code,
  CreditCard,
  Database,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageCircle,
  MessageSquare,
  Settings,
  X,
} from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ThemeToggle } from "./ThemeToggle";

const navSections = [
  {
    label: "Main",
    items: [
      { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
      {
        href: "/dashboard/conversations",
        label: "Conversations",
        icon: MessageSquare,
      },
      {
        href: "/dashboard/data-sources",
        icon: Database,
        label: "Data Sources",
      },
    ],
  },
  {
    label: "Configure",
    items: [
      { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
      { href: "/dashboard/embed", label: "Embed", icon: Code },
      { href: "/dashboard/settings", label: "Settings", icon: Settings },
    ],
  },
  {
    label: "Support",
    items: [
      {
        href: "/dashboard/contact",
        label: "Fallback Contact",
        icon: MessageCircle,
      },
      { href: "/dashboard/usage", label: "Usage", icon: CreditCard },
    ],
  },
];

function SidebarContent({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate: () => void;
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2.5 h-14 px-4 border-b border-border shrink-0">
        <div className="w-6 h-6 bg-primary rounded-sm flex items-center justify-center text-primary-foreground text-xs font-semibold shrink-0">
          {APP_NAME[0]}
        </div>
        <span className="font-semibold text-sm tracking-tight flex-1 truncate">
          {APP_NAME}
        </span>
        <ThemeToggle />
      </div>

      <nav className="flex-1 px-2 py-4 space-y-5 overflow-y-auto">
        {navSections.map((section) => (
          <div key={section.label}>
            <h3 className="px-2 mb-1 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
              {section.label}
            </h3>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm transition-colors",
                      active
                        ? "bg-accent text-foreground font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/60",
                    )}
                  >
                    <item.icon
                      className={cn(
                        "w-4 h-4 shrink-0",
                        active ? "text-primary" : "text-muted-foreground",
                      )}
                    />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-2 border-t border-border shrink-0">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-2.5 px-2 py-1.5 w-full rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!mobileOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMobileOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  return (
    <>
      <div className="hidden md:flex w-56 flex-col border-r border-border bg-card h-screen fixed left-0 top-0">
        <SidebarContent
          pathname={pathname}
          onNavigate={() => setMobileOpen(false)}
        />
      </div>

      <div className="md:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-card border-b border-border px-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 bg-primary rounded-sm flex items-center justify-center text-primary-foreground text-xs font-semibold">
            {APP_NAME[0]}
          </div>
          <span className="font-semibold text-sm">{APP_NAME}</span>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation"
          className="text-muted-foreground hover:text-foreground p-1 rounded-sm"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-foreground/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-60 bg-card border-r border-border">
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation"
              className="absolute top-4 right-3 z-10 text-muted-foreground hover:text-foreground p-1 rounded-sm"
            >
              <X className="w-4 h-4" />
            </button>
            <SidebarContent
              pathname={pathname}
              onNavigate={() => setMobileOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}
