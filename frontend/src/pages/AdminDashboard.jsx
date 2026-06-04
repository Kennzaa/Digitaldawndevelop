import React, { useEffect, useState, useCallback } from "react";
import api from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LayoutDashboard, Inbox, Loader as LoaderIcon, CheckCircle2, Clock, Eye, Mail, Phone, Building2, Calendar, Wallet } from "lucide-react";

const STATUS_META = {
  new: { label: "Baru", cls: "bg-blue-50 text-blue-700 border-blue-200" },
  in_progress: { label: "Diproses", cls: "bg-amber-50 text-amber-700 border-amber-200" },
  done: { label: "Selesai", cls: "bg-green-50 text-green-700 border-green-200" },
  cancelled: { label: "Dibatalkan", cls: "bg-red-50 text-red-700 border-red-200" },
};
const STATUS_OPTIONS = ["new", "in_progress", "done", "cancelled"];

const fmtDate = (iso) => {
  try { return new Date(iso).toLocaleString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }); }
  catch { return iso; }
};

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="glass-strong rounded-[18px] p-5 flex items-center gap-4">
    <div className="h-12 w-12 rounded-xl flex items-center justify-center" style={{ background: `${color}1a`, color }}>
      <Icon className="h-6 w-6" />
    </div>
    <div>
      <p className="text-2xl font-heading font-semibold text-slate-900">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  </div>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState({ total: 0, new: 0, in_progress: 0, done: 0 });
  const [orders, setOrders] = useState(null);
  const [filter, setFilter] = useState("all");
  const [detail, setDetail] = useState(null);

  const load = useCallback(async () => {
    try {
      const [s, o] = await Promise.all([
        api.get("/admin/stats"),
        api.get(`/admin/orders${filter !== "all" ? `?status_filter=${filter}` : ""}`),
      ]);
      setStats(s.data);
      setOrders(o.data);
    } catch (e) {
      toast.error("Gagal memuat data admin.");
      setOrders([]);
    }
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/admin/orders/${id}`, { status });
      toast.success("Status pesanan diperbarui.");
      load();
    } catch (e) {
      toast.error("Gagal memperbarui status.");
    }
  };

  return (
    <div className="section-accent-bg min-h-screen py-12 lg:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-slate-900 flex items-center gap-2"><LayoutDashboard className="h-7 w-7 text-blue-600" />Dashboard Admin</h1>
          <p className="mt-1 text-slate-600">Kelola semua pesanan yang masuk dari customer.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard icon={Inbox} label="Total Pesanan" value={stats.total} color="#2563EB" />
          <StatCard icon={Clock} label="Baru" value={stats.new} color="#0EA5E9" />
          <StatCard icon={LoaderIcon} label="Diproses" value={stats.in_progress} color="#F59E0B" />
          <StatCard icon={CheckCircle2} label="Selesai" value={stats.done} color="#16A34A" />
        </div>

        <Tabs value={filter} onValueChange={setFilter} className="mb-6">
          <TabsList data-testid="admin-filter-tabs">
            <TabsTrigger value="all" data-testid="admin-filter-all">Semua</TabsTrigger>
            <TabsTrigger value="new" data-testid="admin-filter-new">Baru</TabsTrigger>
            <TabsTrigger value="in_progress" data-testid="admin-filter-in_progress">Diproses</TabsTrigger>
            <TabsTrigger value="done" data-testid="admin-filter-done">Selesai</TabsTrigger>
          </TabsList>
        </Tabs>

        {orders === null ? (
          <div className="grid gap-3">{[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}</div>
        ) : orders.length === 0 ? (
          <div className="glass rounded-[20px] p-12 text-center" data-testid="admin-empty-state">
            <Inbox className="h-12 w-12 text-blue-300 mx-auto" />
            <p className="mt-4 text-slate-600">Belum ada pesanan pada filter ini.</p>
          </div>
        ) : (
          <div className="glass-strong rounded-[18px] overflow-hidden" data-testid="admin-orders-list">
            <ScrollArea className="w-full">
              <div className="min-w-[760px]">
                <div className="grid grid-cols-[1.3fr_1.6fr_1fr_1fr_0.8fr] gap-4 px-6 py-3 bg-blue-50/60 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  <span>Customer</span><span>Layanan</span><span>Tanggal</span><span>Status</span><span className="text-right">Aksi</span>
                </div>
                {orders.map((o) => {
                  const meta = STATUS_META[o.status] || STATUS_META.new;
                  return (
                    <div key={o.id} className="grid grid-cols-[1.3fr_1.6fr_1fr_1fr_0.8fr] gap-4 px-6 py-4 border-t border-blue-50 items-center" data-testid={`admin-order-row-${o.id}`}>
                      <div className="min-w-0">
                        <p className="font-medium text-slate-900 truncate">{o.name}</p>
                        <p className="text-xs text-slate-500 truncate">{o.email}</p>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {o.services.slice(0, 2).map((s, i) => <span key={i} className="text-xs rounded-full bg-blue-50 text-blue-700 px-2 py-0.5">{s}</span>)}
                        {o.services.length > 2 && <span className="text-xs text-slate-400">+{o.services.length - 2}</span>}
                      </div>
                      <span className="text-xs text-slate-500">{fmtDate(o.created_at)}</span>
                      <div>
                        <Select value={o.status} onValueChange={(v) => updateStatus(o.id, v)}>
                          <SelectTrigger className="h-8 text-xs w-[130px]" data-testid={`admin-status-select-${o.id}`}><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {STATUS_OPTIONS.map((st) => <SelectItem key={st} value={st}>{STATUS_META[st].label}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => setDetail(o)} data-testid={`admin-view-${o.id}`}><Eye className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>

      <Dialog open={!!detail} onOpenChange={(v) => !v && setDetail(null)}>
        <DialogContent className="max-w-lg" data-testid="admin-order-detail-dialog">
          <DialogHeader><DialogTitle className="font-heading">Detail Pesanan</DialogTitle></DialogHeader>
          {detail && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono-tech text-xs text-blue-400">#{detail.id.slice(0, 8)}</span>
                <Badge className={`${(STATUS_META[detail.status] || STATUS_META.new).cls} border`}>{(STATUS_META[detail.status] || STATUS_META.new).label}</Badge>
              </div>
              <div className="grid gap-2 text-sm">
                <p className="flex items-center gap-2 text-slate-700"><span className="font-medium">{detail.name}</span></p>
                <p className="flex items-center gap-2 text-slate-600"><Mail className="h-4 w-4 text-slate-400" />{detail.email}</p>
                {detail.phone && <p className="flex items-center gap-2 text-slate-600"><Phone className="h-4 w-4 text-slate-400" />{detail.phone}</p>}
                {detail.company && <p className="flex items-center gap-2 text-slate-600"><Building2 className="h-4 w-4 text-slate-400" />{detail.company}</p>}
                {detail.budget && <p className="flex items-center gap-2 text-slate-600"><Wallet className="h-4 w-4 text-slate-400" />{detail.budget}</p>}
                {detail.deadline && <p className="flex items-center gap-2 text-slate-600"><Calendar className="h-4 w-4 text-slate-400" />{detail.deadline}</p>}
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Layanan</p>
                <div className="flex flex-wrap gap-1.5">{detail.services.map((s, i) => <span key={i} className="text-xs rounded-full bg-blue-50 text-blue-700 px-3 py-1">{s}</span>)}</div>
              </div>
              {detail.message && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Brief</p>
                  <p className="text-sm text-slate-700 bg-blue-50/50 rounded-xl p-3 whitespace-pre-wrap">{detail.message}</p>
                </div>
              )}
              <div className="flex gap-2 pt-2">
                <Button asChild variant="outline" className="flex-1 border-green-200"><a href={`https://wa.me/${(detail.phone || "").replace(/[^0-9]/g, "").replace(/^0/, "62")}`} target="_blank" rel="noopener noreferrer">WhatsApp</a></Button>
                <Button asChild variant="outline" className="flex-1 border-blue-200"><a href={`mailto:${detail.email}`}>Email</a></Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
