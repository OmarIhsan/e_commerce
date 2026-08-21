"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/lib/cartStore";
import { ShoppingBag, Search, Sparkles, ShieldCheck, Zap } from "lucide-react";
import { useEffect, useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const toggleDrawer = useCartStore((s) => s.toggleDrawer);
  const getItemCount = useCartStore((s) => s.getItemCount);
  const hasHydrated = useCartStore((s) => s.hasHydrated);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const count = mounted && hasHydrated ? getItemCount() : 0;

  const navLinks = [
    { href: "/", label: "Catalog" },
    { href: "/?category=women", label: "Women" },
    { href: "/?category=men", label: "Men" },
    { href: "/?category=footwear", label: "Footwear" },
    { href: "/?category=tech-accessories", label: "Tech & EDC" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-titanium-950/80 backdrop-blur-xl transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="group flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-subtle bg-gradient-to-br from-cyber-cyan via-cyber-blue to-cyber-indigo p-0.5 shadow-glow">
              <div className="flex h-full w-full items-center justify-center rounded-[5px] bg-titanium-950">
                <Zap className="h-4 w-4 text-cyber-cyan transition-transform duration-300 group-hover:scale-110" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-sm font-black tracking-widest text-titanium-100 uppercase">
                TITAN<span className="text-cyber-cyan">.LAB</span>
              </span>
              <span className="font-mono text-[9px] tracking-wider text-titanium-400 uppercase">
                PRECISION COMMERCE
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-subtle text-xs font-medium uppercase tracking-wider font-mono transition-colors ${
                    isActive
                      ? "text-cyber-cyan bg-white/5 border border-cyber-cyan/30"
                      : "text-titanium-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 text-[11px] font-mono text-titanium-400 bg-white/5 px-2.5 py-1 rounded-subtle border border-white/5">
            <span className="h-1.5 w-1.5 rounded-full bg-cyber-emerald animate-pulse"></span>
            LATENCY: 12ms
          </div>

          <Link
            href="/#catalog"
            className="flex h-9 w-9 items-center justify-center rounded-subtle border border-white/10 bg-titanium-900/60 text-titanium-300 hover:text-white hover:border-white/20 transition-colors"
            title="Search Catalog"
          >
            <Search className="h-4 w-4" />
          </Link>

          {/* Cart trigger button */}
          <button
            onClick={toggleDrawer}
            className="relative flex h-9 items-center gap-2.5 rounded-subtle border border-white/10 bg-titanium-900/80 px-3.5 text-xs font-mono font-medium text-titanium-100 hover:border-cyber-cyan/50 hover:bg-white/5 transition-all shadow-sm group"
            aria-label={`Open Cart with ${count} items`}
          >
            <ShoppingBag className="h-4 w-4 text-cyber-cyan transition-transform group-hover:scale-110" />
            <span className="hidden sm:inline">CART</span>
            {count > 0 && (
              <span className="flex h-5 min-w-[20px] items-center justify-center rounded-pill bg-gradient-to-r from-cyber-cyan to-cyber-blue px-1.5 text-[10px] font-bold text-titanium-950 shadow-glow">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
