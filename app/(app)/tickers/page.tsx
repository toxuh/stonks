"use client";

import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { useCreateTicker, useDeleteTicker, useTickers, useUpdateTicker } from "@/hooks/use-tickers";
import { useHeaderBar } from "@/components/header-bar";
import { Plus } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

interface FormState {

  symbol: string;
  source?: string;
  showOnDashboard?: boolean;
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


  // Setup header title and actions (+)
  useEffect(() => {
    setTitle(<h1 className="text-2xl font-semibold">Tickers</h1>);
    setActions(
      <Button size="sm" onClick={() => setOpen(true)}>
        <Plus size={16} />
      </Button>,
    );
    return () => {
      setTitle(null);
      setActions(null);
    };
  }, [setTitle, setActions]);

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
    <div className="grid gap-4">
      <Toaster />
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 max-w-sm">
          <Input
            placeholder="Search symbols..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>


      <div className="rounded border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Symbol</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Show on dashboard</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4}>Loading...</TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4}>No tickers</TableCell>
              </TableRow>
            ) : (
              items
                .filter((t) => t.symbol.toLowerCase().includes(search.toLowerCase()))
                .map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-mono">{t.symbol}</TableCell>
                  <TableCell>{t.source}</TableCell>
                  <TableCell>
                    <Switch
                      checked={t.showOnDashboard}
                      onCheckedChange={(checked) =>
                        updateMutation.mutate({ id: t.id, input: { showOnDashboard: checked } })
                      }
                    />
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditId(t.id);
                        setForm({ symbol: t.symbol, source: t.source, showOnDashboard: t.showOnDashboard });
                        setOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteMutation.mutate(t.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setEditId(null); setForm({ symbol: "", source: "finnhub", showOnDashboard: false }); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editId ? "Edit ticker" : "Add ticker"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-1">
              <Label htmlFor="symbol">Symbol</Label>
              <Input
                id="symbol"
                placeholder="AAPL"
                value={form.symbol}
                onChange={(e) => setForm((s) => ({ ...s, symbol: e.target.value }))}
              />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="source">Source</Label>
              <Input
                id="source"
                placeholder="finnhub"
                value={form.source}
                onChange={(e) => setForm((s) => ({ ...s, source: e.target.value }))}
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="show"
                checked={!!form.showOnDashboard}
                onCheckedChange={(checked) => setForm((s) => ({ ...s, showOnDashboard: checked }))}
              />
              <Label htmlFor="show">Show on dashboard</Label>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={onSubmit}>{editId ? "Save" : "Create"}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TickersPage;

