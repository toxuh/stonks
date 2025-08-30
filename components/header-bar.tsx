"use client";

import {
  createContext,
  PropsWithChildren,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";

import ModeToggle from "@/components/mode-toggle";
import { Separator } from "@/components/ui/separator";
import { WsStats } from "@/components/ws-stats";
import { WsToggle } from "@/components/ws-toggle";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { Clock, TrendingUp, Users } from "lucide-react";

interface Ctx {
  title: ReactNode | null;
  actions: ReactNode | null;
  setTitle: (n: ReactNode | null) => void;
  setActions: (n: ReactNode | null) => void;
}

const HeaderBarContext = createContext<Ctx | null>(null);

export const HeaderBarProvider = ({
  children,
}: Readonly<PropsWithChildren>) => {
  const [title, setTitle] = useState<ReactNode | null>(null);
  const [actions, setActions] = useState<ReactNode | null>(null);

  const value = useMemo(
    () => ({ title, setTitle, actions, setActions }),
    [title, actions],
  );
  return (
    <HeaderBarContext.Provider value={value}>
      {children}
    </HeaderBarContext.Provider>
  );
};

export const useHeaderBar = () => {
  const ctx = useContext(HeaderBarContext);
  if (!ctx)
    throw new Error("useHeaderBar must be used within HeaderBarProvider");
  return ctx;
};

const QuickStats = () => {
  const currentTime = new Date().toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="hidden md:flex items-center gap-4 text-sm">
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent/50 border border-border/50">
        <Clock className="h-3 w-3 text-muted-foreground" />
        <span className="text-muted-foreground">{currentTime}</span>
      </div>

      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20">
        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
        <span className="text-green-700 dark:text-green-400 font-medium">
          Live
        </span>
      </div>

      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20">
        <TrendingUp className="h-3 w-3 text-primary" />
        <span className="text-primary font-medium">+2.4%</span>
      </div>
    </div>
  );
};

export const Topbar = () => {
  const { title, actions } = useHeaderBar();

  return (
    <div className="sticky top-0 z-10 glass border-b shadow-custom-sm animate-slide-up">
      <div className="flex items-center justify-between px-6 py-4 gap-4">
        <div className="flex flex-col gap-2 min-w-0 flex-1">
          <div className="flex items-center gap-4">
            <div className="flex items-center min-h-[32px]">{title}</div>
            <div className="flex items-center">{actions}</div>
          </div>
          <Breadcrumbs />
        </div>

        <QuickStats />

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-3">
            <WsStats />
            <WsToggle />
          </div>

          <Separator orientation="vertical" className="h-6 opacity-50" />

          <ModeToggle />

          <div className="relative">
            <div className="h-8 w-8 rounded-lg bg-accent/50 border border-border/50 flex items-center justify-center hover:bg-accent transition-colors cursor-pointer">
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs animate-scale-in"
            >
              3
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};
