import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ServiceCard from "@/components/services/ServiceCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FALLBACK_SERVICES, CONTACT, BUDGET_OPTIONS } from "@/data/services";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { burstConfetti } from "@/lib/confetti";
import { Mail, MessageCircle, ClipboardList, Check, Loader2, ShoppingBag, ArrowRight } from "lucide-react";

const DEADLINES = ["Secepatnya (ASAP)", "1 - 2 minggu", "3 - 4 minggu", "Lebih dari 1 bulan", "Fleksibel"];

export default function Order() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [services, setServices] = useState(FALLBACK_SERVICES);
  const [selected, setSelected] = useState(location.state?.preselect || []);
  const [status, setStatus] = useState("idle"); // idle | loading | success
  const [form, setForm] = useState({
    name: "", email: "", phone: "", company: "", budget: "", deadline: "", message: "",
  });

  useEffect(() => {
    api.get("/services").then(({ data }) => {
      if (Array.isArray(data) && data.length) setServices(data);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (user) {
      setForm((f) => ({ ...f, name: f.name || user.name || "", email: f.email || user.email || "" }));
    }
  }, [user]);

  const toggle = (service) => {
    setSelected((prev) => prev.includes(service.id) ? prev.filter((x) => x !== service.id) : [...prev, service.id]);
  };

  const selectedServices = useMemo(
    () => services.filter((s) => selected.includes(s.id)),
    [services, selected]
  );

  const updateField = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const buildMessage = useCallback(() => {
    const list = selectedServices.map((s) => `• ${s.title}`).join("\n");
    return `Halo Digital Dawn Develop, saya ingin order:\n${list || "(belum pilih layanan)"}\n\nNama: ${form.name}\nEmail: ${form.email}\nWhatsApp: ${form.phone}\nBrand/Perusahaan: ${form.company}\nBudget: ${form.budget}\nDeadline: ${form.deadline}\n\nDetail: ${form.message}`;
  }, [selectedServices, form]);

  const waLink = useMemo(() => `https://wa.me/${CONTACT.whatsappIntl}?text=${encodeURIComponent(buildMessage())}`, [buildMessage]);
  const mailLink = useMemo(() => `mailto:${CONTACT.email}?subject=${encodeURIComponent("Order Baru - " + (form.name || "Customer"))}&body=${encodeURIComponent(buildMessage())}`, [buildMessage, form.name]);

   const handleSubmit = async (e) => {
        e.preventDefault();
        if (selected.length === 0) { toast.error("Pilih minimal satu layanan dulu ya."); return; }
        if (!form.name.trim() || !form.email.trim()) { toast.error("Nama dan email wajib diisi."); return; }
        
        if (!isAuthenticated) {
            toast.error("Silakan login atau daftar terlebih dahulu.");
            navigate("/login");
            return;
        }
        
        setStatus("loading");
        try {
            await api.post("/orders", {
                name: form.name.trim(),
                email: form.email.trim(),
                phone: form.phone,
                deadline: form.deadline,
                message: form.message,
      }); 
      setStatus("success");
      burstConfetti();
      toast.success("Pesanan berhasil dikirim!");
    } catch (err) {
      setStatus("idle");
      toast.error(err?.response?.data?.detail || "Gagal mengirim pesanan. Coba lagi.");
    }
  };

  if (status === "success") {
    return (
      <div className="min-h-[80vh] section-accent-bg flex items-center justify-center px-4 py-16">
        <div className="glass-strong rounded-[24px] p-8 sm:p-12 max-w-lg w-full text-center" data-testid="order-success-panel">
          <div className="mx-auto mb-6 h-20 w-20 rounded-full bg-green-500 flex items-center justify-center animate-pop-in animate-success-glow">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path className="animate-checkmark" strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-slate-900">Pesanan Terkirim!</h2>
          <p className="mt-2 text-slate-600">Terima kasih, {form.name.split(" ")[0] || "Sahabat"}! Pesanan Anda sudah kami terima. Lanjutkan kirim brief via WhatsApp atau email agar kami bisa segera memproses.</p>

          <div className="mt-6 rounded-2xl bg-blue-50/70 p-4 text-left">
            <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-2">Layanan dipilih</p>
            <ul className="space-y-1.5">
              {selectedServices.map((s) => (
                <li key={s.id} className="flex items-center gap-2 text-sm text-slate-700"><Check className="h-4 w-4 text-green-600" />{s.title}</li>
              ))}
            </ul>
          </div>

          <div className="mt-7 grid gap-3">
            <Button asChild className="h-12 bg-green-600 hover:bg-green-700 text-white border-0" data-testid="success-whatsapp-button">
              <a href={waLink} target="_blank" rel="noopener noreferrer"><MessageCircle className="h-4 w-4 mr-2" />Kirim via WhatsApp</a>
            </Button>
            <Button asChild variant="outline" className="h-12 border-blue-200" data-testid="success-email-button">
              <a href={mailLink}><Mail className="h-4 w-4 mr-2 text-blue-600" />Kirim via Email</a>
            </Button>
            {isAuthenticated ? (
              <Button variant="ghost" className="h-11 text-slate-600" onClick={() => navigate("/my-orders")} data-testid="success-my-orders-button">
                <ClipboardList className="h-4 w-4 mr-2" />Lihat Pesanan Saya
              </Button>
            ) : (
              <Button variant="ghost" className="h-11 text-slate-600" onClick={() => navigate("/register")}>
                Daftar untuk melacak pesanan
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section-accent-bg min-h-screen py-12 lg:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-sm font-semibold text-blue-600 tracking-wide uppercase">Pesan Layanan</span>
          <h1 className="font-heading text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900 mt-2">Pilih layanan & kirim brief Anda</h1>
          <p className="mt-3 text-slate-600">Centang layanan yang dibutuhkan, isi detail singkat, lalu kirim ke kami.</p>
        </div>

        <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">
          {/* Left: services + form */}
          <div>
            <div className="grid gap-5 sm:grid-cols-2">
              {services.map((s, i) => (
                <ServiceCard key={s.id} service={s} index={i} selected={selected.includes(s.id)} onToggle={toggle} />
              ))}
            </div>

            <form onSubmit={handleSubmit} className="mt-8 glass-strong rounded-[20px] p-6 sm:p-8" data-testid="order-form">
              <h3 className="font-heading text-xl font-semibold text-slate-900 mb-5">Detail Brief</h3>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <Label htmlFor="name">Nama Lengkap *</Label>
                  <Input id="name" value={form.name} onChange={updateField("name")} placeholder="Nama Anda" className="mt-1.5" data-testid="order-name-input" />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" type="email" value={form.email} onChange={updateField("email")} placeholder="email@contoh.com" className="mt-1.5" data-testid="order-email-input" />
                </div>
                <div>
                  <Label htmlFor="phone">No. WhatsApp</Label>
                  <Input id="phone" value={form.phone} onChange={updateField("phone")} placeholder="08xxxxxxxxxx" className="mt-1.5" data-testid="order-phone-input" />
                </div>
                <div>
                  <Label htmlFor="company">Brand / Perusahaan</Label>
                  <Input id="company" value={form.company} onChange={updateField("company")} placeholder="Nama brand Anda" className="mt-1.5" data-testid="order-company-input" />
                </div>
                <div>
                  <Label>Estimasi Budget</Label>
                  <Select value={form.budget} onValueChange={(v) => setForm((f) => ({ ...f, budget: v }))}>
                    <SelectTrigger className="mt-1.5" data-testid="order-budget-select"><SelectValue placeholder="Pilih budget" /></SelectTrigger>
                    <SelectContent>
                      {BUDGET_OPTIONS.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Deadline</Label>
                  <Select value={form.deadline} onValueChange={(v) => setForm((f) => ({ ...f, deadline: v }))}>
                    <SelectTrigger className="mt-1.5" data-testid="order-deadline-select"><SelectValue placeholder="Pilih deadline" /></SelectTrigger>
                    <SelectContent>
                      {DEADLINES.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="mt-5">
                <Label htmlFor="message">Ceritakan kebutuhan Anda</Label>
                <Textarea id="message" value={form.message} onChange={updateField("message")} placeholder="Contoh: Saya butuh landing page untuk produk skincare, target launching bulan depan..." rows={4} className="mt-1.5" data-testid="order-message-input" />
              </div>

              <Button type="submit" disabled={status === "loading"} className="mt-6 w-full h-12 cta-gradient text-white border-0 text-base" data-testid="order-form-submit-button">
                {status === "loading" ? <><Loader2 className="h-5 w-5 mr-2 animate-spin" />Mengirim...</> : <><Send_ />Kirim Pesanan</>}
              </Button>
            </form>
          </div>

          {/* Right: sticky summary */}
          <aside className="lg:sticky lg:top-24">
            <div className="glass-strong rounded-[20px] p-6" data-testid="order-summary">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingBag className="h-5 w-5 text-blue-600" />
                <h3 className="font-heading font-semibold text-slate-900">Ringkasan Pesanan</h3>
              </div>
              {selectedServices.length === 0 ? (
                <p className="text-sm text-slate-500" data-testid="order-summary-empty">Belum ada layanan dipilih. Klik kartu layanan untuk menambahkan.</p>
              ) : (
                <ul className="space-y-3">
                  {selectedServices.map((s) => (
                    <li key={s.id} className="flex items-start justify-between gap-3 text-sm">
                      <span className="flex items-center gap-2 text-slate-700"><span className="h-2 w-2 rounded-full" style={{ background: s.color }} />{s.title}</span>
                      <button type="button" onClick={() => toggle(s)} className="text-xs text-red-500 hover:underline">hapus</button>
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-5 pt-5 border-t border-blue-100 flex items-center justify-between">
                <span className="text-sm text-slate-500">Total layanan</span>
                <span className="font-heading text-2xl font-semibold text-blue-600" data-testid="order-summary-count">{selectedServices.length}</span>
              </div>
              <p className="mt-4 text-xs text-slate-500 flex items-center gap-1"><ArrowRight className="h-3 w-3" />Setelah kirim, Anda bisa lanjut via WhatsApp / Email.</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

const Send_ = () => <ClipboardList className="h-5 w-5 mr-2" />;
