"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Sparklines, SparklinesLine } from "react-sparklines";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Activity,
  DollarSign,
} from "lucide-react";

interface Props {
  symbol: string;
  price: number | null;
  history?: number[];
  loading?: boolean;
}

const calculateChange = (
  history: number[],
): { change: number; changePercent: number } => {
  if (history.length < 2) return { change: 0, changePercent: 0 };

  const current = history[history.length - 1];
  const previous = history[history.length - 2];
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
  const sign = change >= 0 ? "+" : "";
  return `${sign}${change.toFixed(2)}`;
};

export const TickerCard = ({
  symbol,
  price,
  history = [],
  loading = false,
}: Readonly<Props>) => {
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

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-custom-lg hover:scale-[1.02] animate-fade-in gradient-card border-border/50">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-chart-1/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <CardHeader className="pb-3 relative z-10">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-lg font-bold text-foreground">
              {symbol}
            </span>
            <Badge variant="outline" className="text-xs px-2 py-0.5">
              Stock
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
                <span>({changePercent.toFixed(2)}%)</span>
              </div>
            )}
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="relative z-10">
        <div className="h-20 mb-4 rounded-lg overflow-hidden bg-accent/20 p-2">
          {history.length > 1 ? (
            <Sparklines data={history} svgWidth={280} svgHeight={64} margin={4}>
              <SparklinesLine
                color={sparklineColor}
                style={{
                  strokeWidth: 2,
                  fill: "none",
                  filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.1))",
                }}
              />
            </Sparklines>
          ) : (
            <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
              <Activity className="h-4 w-4 mr-2" />
              No data available
            </div>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <DollarSign className="h-3 w-3" />
            <span>Last updated: {new Date().toLocaleTimeString()}</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span>Live</span>
          </div>
        </div>
      </CardContent>

      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-chart-1/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </Card>
  );
};
