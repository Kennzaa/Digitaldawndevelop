import { Globe, Sparkles, Clapperboard, MessageCircle, Megaphone } from "lucide-react";

// Icon name (from backend) -> lucide component
export const ICON_MAP = {
  Globe,
  Sparkles,
  Clapperboard,
  MessageCircle,
  Megaphone,
};

// Fallback static list (used if API fails)
export const FALLBACK_SERVICES = [
  { id: "landing-page", title: "Landing Page Website", tagline: "High-converting, fast & beautiful pages", icon: "Globe", color: "#3B82F6" },
  { id: "content-creator", title: "Content Creator", tagline: "Scroll-stopping content that grows your brand", icon: "Sparkles", color: "#0EA5E9" },
  { id: "designer-reels-banner", title: "Designer Reels & Banner", tagline: "Cinematic reels and striking banners", icon: "Clapperboard", color: "#6366F1" },
  { id: "whatsapp-business", title: "WhatsApp Perusahaan", tagline: "Professional WhatsApp Business setup", icon: "MessageCircle", color: "#22D3EE" },
  { id: "social-ads", title: "Ads Instagram, TikTok & Facebook", tagline: "Targeted ad campaigns that drive results", icon: "Megaphone", color: "#2563EB" },
];

export const CONTACT = {
  email: "Admin@digitaldawndevelop.xyz",
  whatsappDisplay: "0857-6840-9658",
  whatsappIntl: "6285768409658",
};

export const BUDGET_OPTIONS = [
  "< Rp 1 juta",
  "Rp 1 - 3 juta",
  "Rp 3 - 10 juta",
  "> Rp 10 juta",
  "Belum tahu / Diskusi dulu",
];
