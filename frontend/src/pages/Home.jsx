import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GeometricHero from "@/components/hero/GeometricHero";
import ScanlineOverlay from "@/components/hero/ScanlineOverlay";
import ServiceCard from "@/components/services/ServiceCard";
import { Button } from "@/components/ui/button";
import { FALLBACK_SERVICES, CONTACT } from "@/data/services";
import api from "@/lib/api";
import { ArrowDown, MessageCircle, Mail, Rocket, MousePointerClick, FileText, CheckCircle2, Headphones, Send } from "lucide-react";

const HERO_WORDS = ["BUILD", "YOUR", "DREAMS"];

const PROCESS = [
  { icon: MousePointerClick, title: "Pilih Layanan", desc: "Tentukan layanan yang Anda butuhkan dari katalog kami." },
  { icon: FileText, title: "Isi Brief", desc: "Ceritakan kebutuhan brand & tujuan Anda lewat form singkat." },
  { icon: Headphones, title: "Konsultasi", desc: "Diskusi cepat via WhatsApp atau email untuk menyamakan visi." },
  { icon: Rocket, title: "Produksi", desc: "Tim kami mengerjakan project dengan standar premium." },
  { icon: CheckCircle2, title: "Delivery", desc: "Revisi sampai puas, lalu serah terima hasil final." },
];

export default function Home() {
  const navigate = useNavigate();
  const [services, setServices] = useState(FALLBACK_SERVICES);

  useEffect(() => {
    api.get("/services").then(({ data }) => {
      if (Array.isArray(data) && data.length) setServices(data);
    }).catch(() => {});
  }, []);

  const goOrder = (service) => {
    navigate("/order", { state: { preselect: service ? [service.id] : [] } });
  };

  const waLink = `https://wa.me/${CONTACT.whatsappIntl}?text=${encodeURIComponent("Halo Digital Dawn Develop, saya tertarik dengan layanan Anda.")}`;
  const mailLink = `mailto:${CONTACT.email}?subject=${encodeURIComponent("Konsultasi Layanan Digital")}&body=${encodeURIComponent("Halo Digital Dawn Develop,\n\nSaya ingin berkonsultasi mengenai layanan:\n- \n\nTerima kasih.")}`;

  return (
    <div>
      {/* HERO */}
      <section className="relative min-h-[92vh] hero-dark-bg overflow-hidden flex items-center justify-center">
        <GeometricHero />
        <ScanlineOverlay />
        <div className="pointer-events-none absolute inset-0 noise-overlay z-[6]" />

        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur px-4 py-1.5 text-xs font-medium text-cyan-100 mb-7">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            Agency Digital • Project & Creative Studio
          </div>

          <h1 className="font-heading uppercase tracking-[0.14em] text-4xl sm:text-6xl lg:text-7xl font-bold leading-[1.05]">
            <span className="flex flex-wrap justify-center gap-x-4 gap-y-1">
              {HERO_WORDS.map((w, i) => (
                <span key={w} className="hero-word text-gradient-blue drop-shadow-[0_2px_30px_rgba(37,99,235,0.5)]" style={{ animationDelay: `${i * 0.18}s` }}>{w}</span>
              ))}
            </span>
          </h1>

          <p className="hero-word mt-6 text-base sm:text-xl text-blue-50/90 max-w-2xl mx-auto font-medium drop-shadow" style={{ animationDelay: "0.7s" }}>
            Wujudkan brand digital Anda — website, konten, reels & banner, WhatsApp bisnis, hingga iklan media sosial. Semua dalam satu studio kreatif.
          </p>

          <div className="hero-word mt-9 flex flex-col sm:flex-row items-center justify-center gap-3" style={{ animationDelay: "0.95s" }}>
            <Button onClick={() => goOrder(null)} data-testid="hero-pick-services-button" className="cta-gradient text-white border-0 h-12 px-7 text-base shadow-[0_10px_40px_rgba(37,99,235,0.5)]">
              <Send className="h-4 w-4 mr-2" /> Pilih Layanan
            </Button>
            <Button asChild variant="outline" className="h-12 px-7 text-base border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white backdrop-blur" data-testid="hero-whatsapp-button">
              <a href={waLink} target="_blank" rel="noopener noreferrer"><MessageCircle className="h-4 w-4 mr-2 text-green-400" /> Konsultasi WhatsApp</a>
            </Button>
          </div>
        </div>

        <a href="#services" data-testid="hero-scroll-to-explore-button" className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-blue-100/70 hover:text-white transition-colors">
          <span className="text-xs font-medium tracking-wide uppercase">Scroll to explore</span>
          <ArrowDown className="h-5 w-5 animate-bounce-arrow" />
        </a>
      </section>

      {/* SERVICES */}
      <section id="services" className="section-accent-bg py-20 lg:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-sm font-semibold text-blue-600 tracking-wide uppercase">Layanan Kami</span>
            <h2 className="font-heading text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900 mt-2">Apa yang Anda butuhkan?</h2>
            <p className="mt-3 text-slate-600">Pilih satu atau beberapa layanan. Setiap ikon hidup dengan efek 3D — klik untuk mulai memesan.</p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <ServiceCard key={s.id} service={s} index={i} selected={false} onToggle={goOrder} />
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section id="process" className="py-20 lg:py-24 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-sm font-semibold text-blue-600 tracking-wide uppercase">Cara Kerja</span>
            <h2 className="font-heading text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900 mt-2">Proses yang simpel & transparan</h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {PROCESS.map((p, i) => {
              const Icon = p.icon;
              return (
                <div key={p.title} className="glass rounded-[18px] p-6 relative">
                  <span className="font-mono-tech absolute top-4 right-4 text-xs text-blue-300">0{i + 1}</span>
                  <div className="h-12 w-12 rounded-xl cta-gradient flex items-center justify-center shadow-md mb-4">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-heading font-semibold text-slate-900">{p.title}</h3>
                  <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">{p.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-20 lg:py-24 section-accent-bg">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="glass-strong rounded-[24px] p-8 sm:p-12 text-center">
            <h2 className="font-heading text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">Siap memulai project Anda?</h2>
            <p className="mt-3 text-slate-600 max-w-xl mx-auto">Hubungi kami langsung, atau kirim brief lewat form pemesanan. Kami balas dengan cepat.</p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button asChild className="cta-gradient text-white border-0 h-12 px-7" data-testid="contact-order-button">
                <a href="/order"><Send className="h-4 w-4 mr-2" />Kirim Brief Sekarang</a>
              </Button>
              <Button asChild variant="outline" className="h-12 px-7 border-green-200 bg-white/70" data-testid="contact-whatsapp-button">
                <a href={waLink} target="_blank" rel="noopener noreferrer"><MessageCircle className="h-4 w-4 mr-2 text-green-600" />WhatsApp {CONTACT.whatsappDisplay}</a>
              </Button>
              <Button asChild variant="outline" className="h-12 px-7 border-blue-200 bg-white/70" data-testid="contact-email-button">
                <a href={mailLink}><Mail className="h-4 w-4 mr-2 text-blue-600" />Email Kami</a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
