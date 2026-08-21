"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/lib/cartStore";
import { useWishlistStore } from "@/lib/wishlistStore";
import { useCurrencyStore, CURRENCIES, CurrencyCode } from "@/lib/currencyStore";
import { ShoppingBag, Search, Sparkles, ShieldCheck, Zap, Heart, Globe } from "lucide-react";
import { useEffect, useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const toggleDrawer = useCartStore((s) => s.toggleDrawer);
  const getItemCount = useCartStore((s) => s.getItemCount);
  const hasHydrated = useCartStore((s) => s.hasHydrated);

  const wishlistCount = useWishlistStore((s) => s.items.length);
  const currency = useCurrencyStore((s) => s.currency);
  const setCurrency = useCurrencyStore((s) => s.setCurrency);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const count = mounted && hasHydrated ? getItemCount() : 0;
  const wishCount = mounted ? wishlistCount : 0;

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
                E-COMMERCE <span className="text-cyber-cyan">BY OMAR</span>
              </span>
              <span className="font-mono text-[9px] tracking-wider text-titanium-400 uppercase">
                ONLINE STORE
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
        <div className="flex items-center gap-2.5">
          {/* Currency Switcher */}
          <div className="relative flex items-center">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
              className="bg-titanium-900 border border-white/10 text-titanium-200 text-xs font-mono rounded-subtle px-2 py-1.5 pr-6 appearance-none hover:border-white/20 focus:outline-none focus:border-cyber-cyan cursor-pointer transition-colors"
              title="Select Currency"
            >
              {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => (
                <option key={code} value={code} className="bg-titanium-900 text-titanium-100">
                  {CURRENCIES[code].label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-2 text-[10px] text-titanium-400 font-mono">
              ▼
            </div>
          </div>

          {/* Wishlist button */}
          <Link
            href="/wishlist"
            className="relative flex h-9 w-9 items-center justify-center rounded-subtle border border-white/10 bg-titanium-900/80 text-titanium-300 hover:text-white hover:border-cyber-rose/50 transition-all shadow-sm group"
            title="View Wishlist"
          >
            <Heart className={`h-4 w-4 transition-transform group-hover:scale-110 ${wishCount > 0 ? "text-cyber-rose fill-cyber-rose" : ""}`} />
            {wishCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-pill bg-cyber-rose px-1 text-[9px] font-bold text-white shadow-xs">
                {wishCount}
              </span>
            )}
          </Link>

          {/* Search Shortcut */}
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
            className="relative flex h-9 items-center gap-2 rounded-subtle border border-white/10 bg-titanium-900/80 px-3 text-xs font-mono font-medium text-titanium-100 hover:border-cyber-cyan/50 hover:bg-white/5 transition-all shadow-sm group"
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
