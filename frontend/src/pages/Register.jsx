import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Loader2, Mail, Lock, User } from "lucide-react";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (password.length < 6) { toast.error("Password minimal 6 karakter."); return; }
    setLoading(true);
    try {
      const user = await register(name, email, password);
      toast.success(`Akun dibuat. Halo, ${user.name}!`);
      navigate("/my-orders");
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Pendaftaran gagal. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:block relative hero-bg overflow-hidden order-1">
        <div className="absolute inset-0 scanline-overlay" />
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="glass rounded-[28px] p-10 max-w-md">
            <div className="h-16 w-16 rounded-2xl overflow-hidden flex items-center justify-center mb-6">
               <img src="/assets/logo.png" alt="Logo" className="h-16 w-16 object-cover" />
             </div>
            </div>
            <h2 className="font-heading text-2xl font-semibold text-slate-900">Mulai project digital Anda</h2>
            <p className="mt-3 text-slate-600">Buat akun untuk memesan layanan, melacak status pesanan, dan berkomunikasi langsung dengan tim kami.</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center px-6 py-16 bg-white order-0 lg:order-2">
          <div className="w-full max-w-md">
              <Link to="/" className="inline-flex items-center gap-2 mb-8">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl overflow-hidden"><img src="/assets/logo.png" alt="Logo" className="h-9 w-9 object-cover" /></span>
                  <span className="font-heading font-semibold text-slate-900">Digital Dawn Develop</span>
              </Link>
          <form onSubmit={submit} className="mt-8 space-y-5" data-testid="register-form">
            <div>
              <Label htmlFor="name">Nama Lengkap</Label>
              <div className="relative mt-1.5">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama Anda" className="pl-10" data-testid="register-name-input" />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@contoh.com" className="pl-10" data-testid="register-email-input" />
              </div>
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Minimal 6 karakter" className="pl-10" data-testid="register-password-input" />
              </div>
            </div>
            <Button type="submit" disabled={loading} className="w-full h-12 cta-gradient text-white border-0" data-testid="register-submit-button">
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Daftar Sekarang"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
