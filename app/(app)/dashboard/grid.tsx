"use client";

import { useEffect, useMemo } from "react";
import { useHeaderBar } from "@/components/header-bar";
import { TickerCard } from "@/components/dashboard/ticker-card";
import { useDashboardTickers, useLastPrices, useHistories } from "@/hooks/use-dashboard";

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="loading-skeleton h-48 rounded-xl animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
        ))}
      </div>
    );
  }

  if (tickers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
        <div className="text-6xl mb-4 animate-bounce-subtle">📈</div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No Tickers Selected</h3>
        <p className="text-sm text-muted-foreground text-center max-w-md">
          Add some tickers to your dashboard to start tracking market data in real-time.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tickers.map((t, index) => {
        const lp = lastPrices.find((x) => x.symbol === t.symbol);
        const hist = histories.get(t.symbol) ?? [];
        const lastUpdatedTs = lp?.ts ?? hist.at(-1)?.ts ?? null;
        return (
          <div
            key={t.id}
            className="animate-fade-in hover-lift"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <TickerCard
              symbol={t.symbol}
              price={lp?.price ?? null}
              history={hist}
              lastUpdatedTs={lastUpdatedTs}
              loading={pricesLoading || historiesLoading}
            />
          </div>
        );
      })}
    </div>
  );
};

