"use client";

import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface TickerDto {
  id: string;
  symbol: string;
  source: string;
  showOnDashboard: boolean;
  createdAt: string;
}

const QK = {
  list: ["tickers", "list"] as const,
};

export const useTickers = () =>
  useQuery({
    queryKey: QK.list,
    queryFn: async () => {
      const { data } = await axios.get("/api/tickers");
      return data.items as TickerDto[];
    },
  });

export const useCreateTicker = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { symbol: string; source?: string; showOnDashboard?: boolean }) => {
      const { data } = await axios.post("/api/tickers", input);
      return data.item as TickerDto;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.list }),
  });
};

export const useUpdateTicker = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<{ symbol: string; source?: string; showOnDashboard?: boolean }> }) => {
      const { data } = await axios.patch(`/api/tickers/${id}`, input);
      return data.item as TickerDto;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.list }),
  });
};

export const useDeleteTicker = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await axios.delete(`/api/tickers/${id}`);
      return data.item as TickerDto;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.list }),
  });
};

