"use client";

import { useEffect } from "react";
import { useHeaderBar } from "@/components/header-bar";

export const DashboardHeaderConfigurator = () => {
  const { setTitle, setActions } = useHeaderBar();
  useEffect(() => {
    setTitle(<h1 className="text-2xl font-semibold">Dashboard</h1>);
    setActions(null);
    return () => {
      setTitle(null);
      setActions(null);
    };
  }, [setTitle, setActions]);
  return null;
};

