import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Loader2, Mail, Lock } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname;

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success(`Selamat datang, ${user.name}!`);
      if (from) navigate(from, { replace: true });
      else navigate(user.role === "admin" ? "/admin" : "/my-orders");
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Login gagal. Periksa email & password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Form */}
      <div className="flex items-center justify-center px-6 py-16 bg-white">
        <div className="w-full max-w-md">
          <Link to="/" className="inline-flex items-center gap-2 mb-8">
           <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl overflow-hidden"><img src="/assets/logo.png" alt="Logo" className="h-9 w-9 object-cover" /></span>
            <span className="font-heading font-semibold text-slate-900">Digital Dawn Develop</span>
          </Link>
          <h1 className="font-heading text-3xl font-semibold text-slate-900">Masuk ke akun Anda</h1>
          <p className="mt-2 text-slate-600">Belum punya akun? <Link to="/register" className="text-blue-600 font-medium hover:underline" data-testid="login-to-register-link">Daftar gratis</Link></p>

          <form onSubmit={submit} className="mt-8 space-y-5" data-testid="login-form">
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@contoh.com" className="pl-10" data-testid="login-email-input" />
              </div>
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="pl-10" data-testid="login-password-input" />
              </div>
            </div>
            <Button type="submit" disabled={loading} className="w-full h-12 cta-gradient text-white border-0" data-testid="login-submit-button">
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Masuk"}
            </Button>
          </form>
        </div>
      </div>

      {/* Decorative */}
      <div className="hidden lg:block relative hero-bg overflow-hidden">
        <div className="absolute inset-0 scanline-overlay" />
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="glass rounded-[28px] p-10 max-w-md">
           <div className="h-16 w-16 rounded-2xl overflow-hidden flex items-center justify-center mb-6">
              <img src="/assets/logo.png" alt="Logo" className="h-16 w-16 object-cover" />
           </div>
            <h2 className="font-heading text-2xl font-semibold text-slate-900">Selamat datang kembali</h2>
            <p className="mt-3 text-slate-600">Kelola pesanan layanan digital Anda dengan mudah — pantau status, dan lanjutkan brief kapan saja.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
