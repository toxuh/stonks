"use client";
import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TrendingUp, TrendingDown, Minus, Activity } from "lucide-react";

interface Props {
  symbol: string;
  price: number | null;
  history?: { price: number; ts: string }[];
  lastUpdatedTs?: string | null;
  loading?: boolean;
}

const calculateChange = (
  history: { price: number; ts: string }[],
): { change: number; changePercent: number } => {
  if (history.length < 2) return { change: 0, changePercent: 0 };

  const current = history[history.length - 1].price;
  const previous = history[history.length - 2].price;
  const change = current - previous;
  const changePercent = (change / previous) * 100;

  return { change, changePercent };
};

const getTrendIcon = (changePercent: number) => {
  if (changePercent > 0) return TrendingUp;
  if (changePercent < 0) return TrendingDown;
  return Minus;
};

const getTrendColor = (changePercent: number) => {
  if (changePercent > 0) return "text-green-600 dark:text-green-400";
  if (changePercent < 0) return "text-red-600 dark:text-red-400";
  return "text-muted-foreground";
};

const getSparklineColor = (changePercent: number) => {
  if (changePercent > 0) return "#10b981"; // green-500
  if (changePercent < 0) return "#ef4444"; // red-500
  return "#6b7280"; // gray-500
};

const formatPrice = (price: number | null): string => {
  if (price === null) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};

const formatChange = (change: number): string => {
  if (change === 0) return "0.00";
  const sign = change > 0 ? "+" : "";
  return `${sign}${change.toFixed(2)}`;
};

export const TickerCard = ({
  symbol,
  price,
  history = [],
  lastUpdatedTs = null,
  loading = false,
}: Readonly<Props>) => {
  const prevPriceRef = useRef<number | null>(null);
  const [pulse, setPulse] = useState<"up" | "down" | null>(null);

  useEffect(() => {
    if (price === null) return;
    const prev = prevPriceRef.current;
    if (prev !== null && price !== prev) {
      setPulse(price > prev ? "up" : "down");
      const id = setTimeout(() => setPulse(null), 500);
      return () => clearTimeout(id);
    }
    prevPriceRef.current = price;
  }, [price]);

  if (loading) {
    return (
      <Card className="h-48 animate-pulse">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-8 w-20" />
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-16 w-full mb-4" />
          <div className="flex justify-between">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-16" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const { change, changePercent } = calculateChange(history);
  const TrendIcon = getTrendIcon(changePercent);
  const trendColor = getTrendColor(changePercent);
  const sparklineColor = getSparklineColor(changePercent);

  const pulseBg =
    pulse === "up"
      ? "bg-green-500/10"
      : pulse === "down"
        ? "bg-red-500/10"
        : "";
  const pulseShadow =
    pulse === "up"
      ? "shadow-[0_0_0_3px_rgba(34,197,94,0.25)]"
      : pulse === "down"
        ? "shadow-[0_0_0_3px_rgba(239,68,68,0.25)]"
        : "";

  // Asset type detection: Crypto via SOURCE:SYMBOL, FX via prefixes or 6-letter pairs like EURUSD/EURUSD
  const isCrypto = symbol.includes(":") || symbol.startsWith("BINANCE:") || symbol.startsWith("COINBASE:") || symbol.startsWith("KRAKEN:");
  const isFx = symbol.startsWith("FX:") || symbol.startsWith("OANDA:") || /^[A-Z]{3}[A-Z]{3}$/.test(symbol) || /^(?:[A-Z]{3})\/(?:[A-Z]{3})$/.test(symbol);
  const assetLabel = isCrypto ? "Crypto" : isFx ? "FX" : "Stock";
  const assetBadgeClass = isCrypto
    ? "border-amber-500 text-amber-600 dark:text-amber-400"
    : isFx
      ? "border-blue-500 text-blue-600 dark:text-blue-400"
      : "border-muted-foreground/40 text-muted-foreground";

  const percentWithSign = `${changePercent >= 0 ? "+" : ""}${changePercent.toFixed(2)}%`;

  return (
    <Card
      className={`group relative overflow-hidden transition-all duration-300 hover:shadow-custom-lg hover:scale-[1.02] animate-fade-in gradient-card border-border/50 ${pulseBg} ${pulseShadow}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-chart-1/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <CardHeader className="pb-3 relative z-10">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-lg font-bold text-foreground">
              {symbol}
            </span>
            <Badge variant="outline" className={`text-xs px-2 py-0.5 ${assetBadgeClass}`}>
              {assetLabel}
            </Badge>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-2xl font-bold text-foreground">
              {formatPrice(price)}
            </span>
            {history.length > 1 && (
              <div
                className={`flex items-center gap-1 text-sm font-medium ${trendColor}`}
              >
                <TrendIcon className="h-3 w-3" />
                <span>{formatChange(change)}</span>
                <span>({changePercent === 0 ? "0.00%" : percentWithSign})</span>
              </div>
            )}
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="relative z-10">
        <div className="h-20 mb-4 rounded-lg overflow-hidden bg-accent/20 p-2">
          {history.length > 1 ? (
            <ResponsiveContainer width="100%" height={64}>
              <LineChart
                data={history}
                margin={{ top: 4, right: 8, left: 8, bottom: 0 }}
              >
                <XAxis
                  dataKey="ts"
                  hide
                  tickFormatter={(v) => dayjs(v).format("HH:mm:ss")}
                />
                <YAxis hide domain={["auto", "auto"]} />
                <Tooltip
                  cursor={{ stroke: "#94a3b8", strokeWidth: 1, opacity: 0.4 }}
                  contentStyle={{ fontSize: 12, padding: 6, background: "hsl(var(--popover))", color: "hsl(var(--popover-foreground))", border: "1px solid hsl(var(--border))", borderRadius: 8 }}
                  labelStyle={{ color: "hsl(var(--muted-foreground))" }}
                  labelFormatter={(v: string) => dayjs(v).format("HH:mm:ss")}
                  formatter={(value: number) => [formatPrice(Number(value)), "Price"]}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke={sparklineColor}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
              <Activity className="h-4 w-4 mr-2" />
              No data available
            </div>
          )}
        </div>

      </CardContent>

      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-chart-1/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </Card>
  );
};
