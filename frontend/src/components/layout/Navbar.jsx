import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import ThemeToggle from "@/components/layout/ThemeToggle";
import { Menu, Sparkles, LayoutDashboard, LogOut, User, ClipboardList } from "lucide-react";

const NavLinks = ({ onNavigate }) => (
  <>
    <a href="/#services" onClick={onNavigate} data-testid="nav-services" className="text-sm font-medium text-slate-700 hover:text-blue-700 transition-colors">Layanan</a>
    <a href="/#process" onClick={onNavigate} data-testid="nav-process" className="text-sm font-medium text-slate-700 hover:text-blue-700 transition-colors">Proses</a>
    <a href="/#contact" onClick={onNavigate} data-testid="nav-contact" className="text-sm font-medium text-slate-700 hover:text-blue-700 transition-colors">Kontak</a>
  </>
);

export const Navbar = () => {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50">
      <div className="glass-strong border-b border-blue-100/70">
        <nav className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" data-testid="nav-logo" className="flex items-center gap-2 group">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl cta-gradient shadow-md">
              <Sparkles className="h-5 w-5 text-white" />
            </span>
            <span className="font-heading font-semibold text-slate-900 leading-tight">
              Digital Dawn<span className="text-blue-600">.</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-7">
            <NavLinks />
          </div>

          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
            {!isAuthenticated ? (
              <>
                <Button asChild variant="ghost" className="text-slate-700" data-testid="nav-login-link">
                  <Link to="/login">Masuk</Link>
                </Button>
                <Button asChild className="cta-gradient text-white border-0" data-testid="nav-register-link">
                  <Link to="/register">Daftar</Link>
                </Button>
              </>
            ) : (
              <>
                {isAdmin && (
                  <Button asChild variant="ghost" className="text-slate-700" data-testid="nav-admin-link">
                    <Link to="/admin"><LayoutDashboard className="h-4 w-4 mr-1.5" />Admin</Link>
                  </Button>
                )}
                <Button asChild variant="ghost" className="text-slate-700" data-testid="nav-my-orders-link">
                  <Link to="/my-orders"><ClipboardList className="h-4 w-4 mr-1.5" />Pesanan</Link>
                </Button>
                <span className="hidden lg:inline text-sm text-slate-500 max-w-[120px] truncate">{user?.name}</span>
                <Button variant="outline" onClick={handleLogout} data-testid="nav-logout-button" className="border-blue-200">
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            )}
            <Button asChild className="cta-gradient text-white border-0" data-testid="nav-order-cta">
              <Link to="/order">Pilih Layanan</Link>
            </Button>
          </div>

          {/* Mobile */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" data-testid="nav-mobile-menu-button"><Menu className="h-6 w-6" /></Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <div className="flex flex-col gap-5 mt-8">
                  <NavLinks onNavigate={() => setOpen(false)} />
                  <div className="h-px bg-blue-100 my-2" />
                  <SheetClose asChild>
                    <Link to="/order" className="cta-gradient text-white rounded-xl px-4 py-2.5 text-center font-medium" data-testid="nav-mobile-order">Pilih Layanan</Link>
                  </SheetClose>
                  {!isAuthenticated ? (
                    <>
                      <SheetClose asChild><Link to="/login" className="text-slate-700 font-medium" data-testid="nav-mobile-login">Masuk</Link></SheetClose>
                      <SheetClose asChild><Link to="/register" className="text-blue-700 font-medium" data-testid="nav-mobile-register">Daftar</Link></SheetClose>
                    </>
                  ) : (
                    <>
                      {isAdmin && <SheetClose asChild><Link to="/admin" className="text-slate-700 font-medium flex items-center gap-2"><LayoutDashboard className="h-4 w-4" />Admin</Link></SheetClose>}
                      <SheetClose asChild><Link to="/my-orders" className="text-slate-700 font-medium flex items-center gap-2"><ClipboardList className="h-4 w-4" />Pesanan Saya</Link></SheetClose>
                      <SheetClose asChild><button onClick={handleLogout} className="text-left text-red-600 font-medium flex items-center gap-2"><LogOut className="h-4 w-4" />Keluar</button></SheetClose>
                      <div className="flex items-center gap-2 text-sm text-slate-500"><User className="h-4 w-4" />{user?.name}</div>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
