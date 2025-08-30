"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LineChart, Settings } from "lucide-react";

import { Separator } from "@/components/ui/separator";

interface NavItemProps {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

const NavItem = ({ href, icon: Icon, label }: Readonly<NavItemProps>) => {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`group relative flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
        active
          ? "bg-accent text-accent-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
      }`}
    >
      <Icon className={`size-4 transition-colors ${active ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"}`} />
      <span className="truncate">{label}</span>
    </Link>
  );
};

export const Sidebar = () => {
  return (
    <aside className="sticky top-0 flex h-screen w-64 flex-col gap-3 border-r bg-background/60 p-3 backdrop-blur supports-[backdrop-filter]:bg-background/40">
      <div className="flex items-center justify-between gap-3 px-1 py-1.5">
        <span className="text-base font-semibold tracking-tight bg-gradient-to-r from-primary to-[var(--chart-1)] bg-clip-text text-transparent">
          Stonks
        </span>
      </div>
      <Separator />
      <nav className="flex flex-col gap-1">
        <NavItem href="/dashboard" icon={Home} label="Dashboard" />
        <NavItem href="/tickers" icon={LineChart} label="Tickers" />
        <NavItem href="/settings" icon={Settings} label="Settings" />
      </nav>
    </aside>
  );
};
