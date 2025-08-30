"use client";

import axios from "axios";
import { useQuery } from "@tanstack/react-query";

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

export const useLastPrices = (symbols: string[]) =>
  useQuery({
    queryKey: ["dashboard", "last-prices", symbols.sort().join(",")],
    queryFn: async () => {
      if (symbols.length === 0) return [] as LastPriceDto[];
      const { data } = await axios.get("/api/dashboard/last-prices", { params: { symbols: symbols.join(",") } });
      return data.items as LastPriceDto[];
    },
    enabled: symbols.length > 0,
  });

