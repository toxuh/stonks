"use client";

import { useEffect, useMemo } from "react";
import { useHeaderBar } from "@/components/header-bar";
import { TickerCard } from "@/components/dashboard/ticker-card";
import { useDashboardTickers, useLastPrices, useHistories } from "@/hooks/use-dashboard";
import { Skeleton } from "@/components/ui/skeleton";

export const DashboardGrid = () => {
  const { setTitle, setActions } = useHeaderBar();
  useEffect(() => {
    setTitle(<h1 className="text-2xl font-semibold">Dashboard</h1>);
    setActions(null);
    return () => {
      setTitle(null);
      setActions(null);
    };
  }, [setTitle, setActions]);
  const { data: tickers = [], isLoading: tickersLoading } = useDashboardTickers();
  const symbols = useMemo(() => tickers.map((t) => t.symbol), [tickers]);
  const { data: lastPrices = [], isLoading: pricesLoading } = useLastPrices(symbols);
  const { histories, isLoading: historiesLoading } = useHistories(symbols);

  if (tickersLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    );
  }

  if (tickers.length === 0) {
    return <div className="text-sm text-muted-foreground">No tickers selected for dashboard.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tickers.map((t) => {
        const lp = lastPrices.find((x) => x.symbol === t.symbol);
        const hist = histories.get(t.symbol) ?? [];
        return (
          <TickerCard
            key={t.id}
            symbol={t.symbol}
            price={(lp?.price as any) ?? null}
            history={hist}
            loading={pricesLoading || historiesLoading}
          />
        );
      })}
    </div>
  );
};

