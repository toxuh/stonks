"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparklines, SparklinesLine } from "react-sparklines";

interface Props {
  symbol: string;
  price: number | null;
  history?: number[];
  loading?: boolean;
}

export const TickerCard = ({ symbol, price, history = [], loading = false }: Readonly<Props>) => {
  if (loading) return <Skeleton className="h-32" />;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="font-mono">{symbol}</span>
          <span className="text-xl font-semibold">{price ?? "—"}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-16">
          {history.length > 1 ? (
            <Sparklines data={history} svgWidth={300} svgHeight={64}>
              <SparklinesLine color="#0ea5e9" />
            </Sparklines>
          ) : (
            <div className="text-sm text-muted-foreground">No data</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

