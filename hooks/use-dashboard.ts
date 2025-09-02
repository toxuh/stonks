"use client";

import axios from "axios";
import { useQuery, useQueries } from "@tanstack/react-query";

export interface LastPriceDto {
  symbol: string;
  price: number;
  ts: string;
}

export const useDashboardTickers = () =>
  useQuery({
    queryKey: ["dashboard", "tickers"],
    queryFn: async () => {
      const { data } = await axios.get("/api/dashboard/tickers");
      return data.items as { id: string; symbol: string; source: string }[];
    },
  });

export const useLastPrices = (symbols: string[], refetchMs = 3000) =>
  useQuery({
    queryKey: ["dashboard", "last-prices", symbols.slice().sort().join(",")],
    queryFn: async () => {
      if (symbols.length === 0) return [] as LastPriceDto[];
      const { data } = await axios.get("/api/dashboard/last-prices", { params: { symbols: symbols.join(",") } });
      return data.items as LastPriceDto[];
    },
    enabled: symbols.length > 0,
    refetchInterval: refetchMs,
    staleTime: refetchMs,
  });

export interface HistoryPoint { price: number; ts: string; createdAt: string }

export const useHistories = (symbols: string[], limit = 50, refetchMs = 10000) => {
  const queries = useQueries({
    queries: symbols.map((symbol) => ({
      queryKey: ["dashboard", "history", symbol, limit],
      queryFn: async () => {
        const { data } = await axios.get("/api/dashboard/history", { params: { symbol, limit } });
        return (data.items as HistoryPoint[]) ?? [];
      },
      refetchInterval: refetchMs,
      staleTime: refetchMs,
    })),
  });
  const map = new Map<string, HistoryPoint[]>();
  symbols.forEach((s, i) => {
    map.set(s, (queries[i].data as HistoryPoint[]) ?? []);
  });
  const isLoading = queries.some((q) => q.isLoading);
  return { histories: map, isLoading } as const;
};

