"use client";

import { createContext, PropsWithChildren, ReactNode, useContext, useMemo, useState } from "react";

import ModeToggle from "@/components/mode-toggle";
import { Separator } from "@/components/ui/separator";
import { WsStats } from "@/components/ws-stats";
import { WsToggle } from "@/components/ws-toggle";

interface Ctx {
  title: ReactNode | null;
  actions: ReactNode | null;
  setTitle: (n: ReactNode | null) => void;
  setActions: (n: ReactNode | null) => void;
}

const HeaderBarContext = createContext<Ctx | null>(null);

export const HeaderBarProvider = ({ children }: Readonly<PropsWithChildren>) => {
  const [title, setTitle] = useState<ReactNode | null>(null);
  const [actions, setActions] = useState<ReactNode | null>(null);

  const value = useMemo(() => ({ title, setTitle, actions, setActions }), [title, actions]);
  return <HeaderBarContext.Provider value={value}>{children}</HeaderBarContext.Provider>;
};

export const useHeaderBar = () => {
  const ctx = useContext(HeaderBarContext);
  if (!ctx) throw new Error("useHeaderBar must be used within HeaderBarProvider");
  return ctx;
};

export const Topbar = () => {
  const { title, actions } = useHeaderBar();
  return (
    <div className="sticky top-0 z-10 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="flex items-center justify-between px-6 py-3 gap-3">
        <div className="min-h-[40px] flex items-center gap-3">
          <div className="flex items-center">{title}</div>
          <div className="flex items-center">{actions}</div>
        </div>
        <div className="flex items-center gap-3">
          <ModeToggle />
          <Separator orientation="vertical" className="h-6" />
          <WsStats />
          <WsToggle />
        </div>
      </div>
    </div>
  );
};

