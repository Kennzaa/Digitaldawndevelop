import React from "react";
import { Link } from "react-router-dom";
import { CONTACT } from "@/data/services";
import { Mail, Phone, Sparkles, MessageCircle } from "lucide-react";

export const Footer = () => {
  const waLink = `https://wa.me/${CONTACT.whatsappIntl}?text=${encodeURIComponent("Halo Digital Dawn Develop, saya ingin bertanya tentang layanan Anda.")}`;
  const mailLink = `mailto:${CONTACT.email}?subject=${encodeURIComponent("Pertanyaan Layanan")}`;
  return (
    <footer className="relative mt-24 border-t border-blue-100 bg-white" id="contact-footer">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-14 grid gap-10 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl cta-gradient shadow-md">
              <Sparkles className="h-5 w-5 text-white" />
            </span>
            <span className="font-heading font-semibold text-slate-900">Digital Dawn Develop</span>
          </div>
          <p className="mt-4 text-sm text-slate-600 leading-relaxed max-w-xs">
            Agency digital yang membantu brand Anda tumbuh: website, konten, reels & banner, WhatsApp bisnis, dan iklan media sosial.
          </p>
        </div>

        <div>
          <h4 className="font-heading font-semibold text-slate-900 mb-4">Navigasi</h4>
          <ul className="space-y-2.5 text-sm text-slate-600">
            <li><a href="/#services" className="hover:text-blue-700">Layanan</a></li>
            <li><a href="/#process" className="hover:text-blue-700">Proses Kerja</a></li>
            <li><Link to="/order" className="hover:text-blue-700">Pilih Layanan</Link></li>
            <li><Link to="/login" className="hover:text-blue-700">Masuk / Daftar</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-heading font-semibold text-slate-900 mb-4">Hubungi Kami</h4>
          <ul className="space-y-3 text-sm text-slate-700">
            <li>
              <a href={mailLink} data-testid="footer-email-link" className="flex items-center gap-3 hover:text-blue-700">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-700"><Mail className="h-4 w-4" /></span>
                {CONTACT.email}
              </a>
            </li>
            <li>
              <a href={waLink} target="_blank" rel="noopener noreferrer" data-testid="footer-whatsapp-link" className="flex items-center gap-3 hover:text-green-700">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-green-50 text-green-600"><MessageCircle className="h-4 w-4" /></span>
                WhatsApp: {CONTACT.whatsappDisplay}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-blue-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-5 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>&copy; {new Date().getFullYear()} Digital Dawn Develop. All rights reserved.</span>
          <span className="font-mono-tech">Built with passion + 3D ✦</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
