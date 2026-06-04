import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ClipboardList, PackageOpen, Calendar, Wallet, Plus } from "lucide-react";

const STATUS_META = {
  new: { label: "Baru", cls: "bg-blue-50 text-blue-700 border-blue-200" },
  in_progress: { label: "Diproses", cls: "bg-amber-50 text-amber-700 border-amber-200" },
  done: { label: "Selesai", cls: "bg-green-50 text-green-700 border-green-200" },
  cancelled: { label: "Dibatalkan", cls: "bg-red-50 text-red-700 border-red-200" },
};

const fmtDate = (iso) => {
  try { return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }); }
  catch { return iso; }
};

export default function MyOrders() {
  const [orders, setOrders] = useState(null);

  useEffect(() => {
    api.get("/orders/me").then(({ data }) => setOrders(data)).catch(() => setOrders([]));
  }, []);

  return (
    <div className="section-accent-bg min-h-screen py-12 lg:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
          <div>
            <h1 className="font-heading text-3xl font-semibold tracking-tight text-slate-900 flex items-center gap-2"><ClipboardList className="h-7 w-7 text-blue-600" />Pesanan Saya</h1>
            <p className="mt-1 text-slate-600">Pantau semua pesanan layanan Anda.</p>
          </div>
          <Button asChild className="cta-gradient text-white border-0" data-testid="my-orders-new-button"><Link to="/order"><Plus className="h-4 w-4 mr-2" />Pesan Lagi</Link></Button>
        </div>

        {orders === null ? (
          <div className="grid gap-4">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-28 w-full rounded-2xl" />)}</div>
        ) : orders.length === 0 ? (
          <div className="glass rounded-[20px] p-12 text-center" data-testid="my-orders-empty-state">
            <PackageOpen className="h-12 w-12 text-blue-300 mx-auto" />
            <h3 className="mt-4 font-heading text-xl font-semibold text-slate-900">Belum ada pesanan</h3>
            <p className="mt-2 text-slate-600">Yuk mulai project digital pertama Anda bersama kami.</p>
            <Button asChild className="mt-6 cta-gradient text-white border-0"><Link to="/order">Pilih Layanan</Link></Button>
          </div>
        ) : (
          <div className="grid gap-4" data-testid="my-orders-list">
            {orders.map((o) => {
              const meta = STATUS_META[o.status] || STATUS_META.new;
              return (
                <div key={o.id} className="glass-strong rounded-[18px] p-6" data-testid={`my-order-${o.id}`}>
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-[200px]">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {o.services.map((s, idx) => (
                          <span key={idx} className="text-xs rounded-full bg-blue-50 text-blue-700 px-3 py-1 font-medium">{s}</span>
                        ))}
                      </div>
                      {o.message && <p className="text-sm text-slate-600 line-clamp-2">{o.message}</p>}
                      <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{fmtDate(o.created_at)}</span>
                        {o.budget && <span className="flex items-center gap-1"><Wallet className="h-3.5 w-3.5" />{o.budget}</span>}
                        <span className="font-mono-tech text-blue-300">#{o.id.slice(0, 8)}</span>
                      </div>
                    </div>
                    <Badge className={`${meta.cls} border`} data-testid={`my-order-status-${o.id}`}>{meta.label}</Badge>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
