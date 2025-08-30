"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LineChart,
  Settings,
  TrendingUp,
  BarChart3,
  Activity,
  Zap,
} from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface NavItemProps {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  badge?: string;
}

const NavItem = ({
  href,
  icon: Icon,
  label,
  badge,
}: Readonly<NavItemProps>) => {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ease-in-out animate-fade-in ${
        active
          ? "bg-primary text-primary-foreground shadow-custom-md scale-[1.02] translate-x-1"
          : "text-muted-foreground hover:text-foreground hover:bg-accent/80 hover:scale-[1.01] hover:translate-x-0.5"
      }`}
    >
      {active && (
        <div className="absolute -left-1 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primary-foreground animate-scale-in" />
      )}

      <Icon
        className={`size-4 transition-all duration-200 ${
          active
            ? "text-primary-foreground scale-110"
            : "text-muted-foreground group-hover:text-foreground group-hover:scale-105"
        }`}
      />

      <span className="truncate flex-1">{label}</span>

      {badge && (
        <Badge
          variant={active ? "secondary" : "outline"}
          className="text-xs px-1.5 py-0.5 animate-scale-in"
        >
          {badge}
        </Badge>
      )}

      <div
        className={`absolute inset-0 rounded-xl bg-gradient-to-r from-primary/10 to-chart-1/10 opacity-0 transition-opacity duration-200 ${
          !active ? "group-hover:opacity-100" : ""
        }`}
      />
    </Link>
  );
};

export const Sidebar = () => {
  return (
    <aside className="sticky top-0 flex h-screen w-64 flex-col gap-4 border-r glass shadow-custom-lg p-4 animate-slide-up">
      <div className="flex items-center gap-3 px-2 py-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-custom-sm">
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-bold tracking-tight text-gradient-primary">
            StockFlow
          </span>
          <span className="text-xs text-muted-foreground">
            Market Analytics
          </span>
        </div>
      </div>

      <Separator className="opacity-50" />

      <nav className="flex flex-col gap-2">
        <div className="px-2 py-1">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Overview
          </h3>
        </div>
        <NavItem
          href="/dashboard"
          icon={BarChart3}
          label="Dashboard"
          badge="Live"
        />
        <NavItem href="/tickers" icon={LineChart} label="Tickers" />
        <NavItem href="/settings" icon={Settings} label="Settings" />
      </nav>

      <Separator className="opacity-50" />

      <nav className="flex flex-col gap-2">
        <div className="px-2 py-1">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Tools
          </h3>
        </div>
        <NavItem href="/analytics" icon={Activity} label="Analytics" />
        <NavItem href="/alerts" icon={Zap} label="Alerts" badge="3" />
      </nav>

      <div className="mt-auto">
        <Separator className="opacity-50 mb-4" />
        <div className="px-2 py-3 rounded-xl bg-gradient-to-br from-primary/10 to-chart-1/10 border border-primary/20">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-medium text-foreground">
              Market Open
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            Real-time data streaming
          </div>
        </div>
      </div>
    </aside>
  );
};
