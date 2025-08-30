"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LineChart, Settings } from "lucide-react";

import ModeToggle from "@/components/mode-toggle";
import { Separator } from "@/components/ui/separator";

interface NavItemProps {
  href: string;
  icon: any;
  label: string;
}

const NavItem = ({ href, icon: Icon, label }: Readonly<NavItemProps>) => {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <Link
      href={href}
      className={`flex items-center gap-2 px-3 py-2 rounded text-sm ${active ? "bg-secondary" : "hover:bg-secondary/60"}`}
    >
      <Icon size={18} />
      <span>{label}</span>
    </Link>
  );
};

export const Sidebar = () => {
  return (
    <aside className="h-screen w-64 border-r flex flex-col p-3 gap-3 sticky top-0">
      <div className="flex items-center justify-between gap-3">
        <span className="font-bold">Stonks</span>
        <ModeToggle />
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
