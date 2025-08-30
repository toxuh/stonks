"use client";

import { useEffect, useState, useMemo } from "react";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { useCreateTicker, useDeleteTicker, useTickers, useUpdateTicker } from "@/hooks/use-tickers";
import { useHeaderBar } from "@/components/header-bar";
import { Plus, Search, SortAsc, SortDesc, Edit, Trash2, Eye, EyeOff, MoreHorizontal } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FormState {
  symbol: string;
  source?: string;
  showOnDashboard?: boolean;
}

type SortField = 'symbol' | 'source' | 'showOnDashboard';
type SortDirection = 'asc' | 'desc';

interface SortState {
  field: SortField;
  direction: SortDirection;
}

const TickersPage = () => {
  const { data: items = [], isLoading } = useTickers();
  const createMutation = useCreateTicker();
  const updateMutation = useUpdateTicker();
  const deleteMutation = useDeleteTicker();

  const { setTitle, setActions } = useHeaderBar();

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>({ symbol: "", source: "finnhub", showOnDashboard: false });
  const [editId, setEditId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [dashboardFilter, setDashboardFilter] = useState<string>("all");
  const [sort, setSort] = useState<SortState>({ field: 'symbol', direction: 'asc' });

  // Фильтрация и сортировка данных
  const filteredAndSortedItems = useMemo(() => {
    const filtered = items.filter((item) => {
      const matchesSearch = item.symbol.toLowerCase().includes(search.toLowerCase());
      const matchesSource = sourceFilter === "all" || item.source === sourceFilter;
      const matchesDashboard = dashboardFilter === "all" ||
        (dashboardFilter === "dashboard" && item.showOnDashboard) ||
        (dashboardFilter === "hidden" && !item.showOnDashboard);

      return matchesSearch && matchesSource && matchesDashboard;
    });

    // Сортировка
    filtered.sort((a, b) => {
      let aValue = a[sort.field];
      let bValue = b[sort.field];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sort.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sort.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [items, search, sourceFilter, dashboardFilter, sort]);

  const handleSort = (field: SortField) => {
    setSort(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };


  // Setup header title and actions
  useEffect(() => {
    setTitle(
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold text-gradient-primary">Tickers Management</h1>
        <Badge variant="outline" className="text-xs">
          {filteredAndSortedItems.length} of {items.length}
        </Badge>
      </div>
    );
    setActions(
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => setOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Ticker
        </Button>
      </div>
    );
    return () => {
      setTitle(null);
      setActions(null);
    };
  }, [setTitle, setActions, filteredAndSortedItems.length, items.length]);

  const onSubmit = async () => {
    try {
      if (editId) {
        await updateMutation.mutateAsync({ id: editId, input: form });
        toast("Ticker updated");
      } else {
        await createMutation.mutateAsync(form);
        toast("Ticker created");
      }
      setOpen(false);
      setEditId(null);
      setForm({ symbol: "", source: "finnhub", showOnDashboard: false });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Error";
      toast(message);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Toaster />

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="gradient-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Tickers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gradient-primary">{items.length}</div>
          </CardContent>
        </Card>

        <Card className="gradient-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">On Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {items.filter(item => item.showOnDashboard).length}
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-2">
              {new Set(items.map(item => item.source)).size}
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Filtered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-3">{filteredAndSortedItems.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Фильтры и поиск */}
      <Card className="p-4 glass">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search symbols..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="finnhub">Finnhub</SelectItem>
                <SelectItem value="yahoo">Yahoo</SelectItem>
                <SelectItem value="alpha">Alpha Vantage</SelectItem>
              </SelectContent>
            </Select>

            <Select value={dashboardFilter} onValueChange={setDashboardFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Dashboard" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Items</SelectItem>
                <SelectItem value="dashboard">On Dashboard</SelectItem>
                <SelectItem value="hidden">Hidden</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>


      {/* Таблица */}
      <Card className="gradient-card shadow-custom-md">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50">
              <TableHead className="font-semibold">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('symbol')}
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                >
                  Symbol
                  {sort.field === 'symbol' && (
                    sort.direction === 'asc' ? <SortAsc className="ml-1 h-3 w-3" /> : <SortDesc className="ml-1 h-3 w-3" />
                  )}
                </Button>
              </TableHead>
              <TableHead className="font-semibold">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('source')}
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                >
                  Source
                  {sort.field === 'source' && (
                    sort.direction === 'asc' ? <SortAsc className="ml-1 h-3 w-3" /> : <SortDesc className="ml-1 h-3 w-3" />
                  )}
                </Button>
              </TableHead>
              <TableHead className="font-semibold">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('showOnDashboard')}
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                >
                  Dashboard
                  {sort.field === 'showOnDashboard' && (
                    sort.direction === 'asc' ? <SortAsc className="ml-1 h-3 w-3" /> : <SortDesc className="ml-1 h-3 w-3" />
                  )}
                </Button>
              </TableHead>
              <TableHead className="text-right font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    Loading tickers...
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredAndSortedItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  <div className="text-muted-foreground">
                    {items.length === 0 ? "No tickers found. Add your first ticker!" : "No tickers match your filters."}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSortedItems.map((t) => (
                <TableRow key={t.id} className="group hover:bg-accent/50 transition-colors">
                  <TableCell className="font-mono font-semibold text-primary">{t.symbol}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {t.source}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={t.showOnDashboard}
                        onCheckedChange={(checked) =>
                          updateMutation.mutate({ id: t.id, input: { showOnDashboard: checked } })
                        }
                        className="data-[state=checked]:bg-primary"
                      />
                      {t.showOnDashboard ? (
                        <Eye className="h-3 w-3 text-green-600" />
                      ) : (
                        <EyeOff className="h-3 w-3 text-muted-foreground" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem
                          onClick={() => {
                            setEditId(t.id);
                            setForm({ symbol: t.symbol, source: t.source, showOnDashboard: t.showOnDashboard });
                            setOpen(true);
                          }}
                          className="gap-2"
                        >
                          <Edit className="h-3 w-3" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => deleteMutation.mutate(t.id)}
                          className="gap-2 text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Диалог создания/редактирования */}
      <Dialog open={open} onOpenChange={(v) => {
        setOpen(v);
        if (!v) {
          setEditId(null);
          setForm({ symbol: "", source: "finnhub", showOnDashboard: false });
        }
      }}>
        <DialogContent className="sm:max-w-md animate-scale-in">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-xl font-semibold text-gradient-primary">
              {editId ? "Edit Ticker" : "Add New Ticker"}
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              {editId ? "Update ticker information" : "Add a new stock ticker to track"}
            </p>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="symbol" className="text-sm font-medium">
                Stock Symbol
              </Label>
              <Input
                id="symbol"
                placeholder="e.g., AAPL, GOOGL, TSLA"
                value={form.symbol}
                onChange={(e) => setForm((s) => ({ ...s, symbol: e.target.value.toUpperCase() }))}
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">
                Enter the stock symbol (ticker) you want to track
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="source" className="text-sm font-medium">
                Data Source
              </Label>
              <Select
                value={form.source}
                onValueChange={(value) => setForm((s) => ({ ...s, source: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select data source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="finnhub">Finnhub</SelectItem>
                  <SelectItem value="yahoo">Yahoo Finance</SelectItem>
                  <SelectItem value="alpha">Alpha Vantage</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Choose the data provider for this ticker
              </p>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-accent/50 border border-border/50">
              <div className="space-y-1">
                <Label htmlFor="show" className="text-sm font-medium cursor-pointer">
                  Show on Dashboard
                </Label>
                <p className="text-xs text-muted-foreground">
                  Display this ticker on the main dashboard
                </p>
              </div>
              <Switch
                id="show"
                checked={!!form.showOnDashboard}
                onCheckedChange={(checked) => setForm((s) => ({ ...s, showOnDashboard: checked }))}
                className="data-[state=checked]:bg-primary"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                className="px-6"
              >
                Cancel
              </Button>
              <Button
                onClick={onSubmit}
                className="px-6 bg-primary hover:bg-primary/90"
                disabled={!form.symbol.trim()}
              >
                {editId ? "Save Changes" : "Add Ticker"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TickersPage;

