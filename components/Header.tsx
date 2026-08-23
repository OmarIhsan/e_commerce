"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/lib/cartStore";
import { useWishlistStore } from "@/lib/wishlistStore";
import { useCurrencyStore, CURRENCIES, CurrencyCode } from "@/lib/currencyStore";
import { useEcomI18n } from "@/lib/i18n";
import { LanguageToggle } from "@/components/LanguageToggle";
import { ShoppingBag, Search, Heart } from "lucide-react";
import { useEffect, useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const toggleDrawer = useCartStore((s) => s.toggleDrawer);
  const getItemCount = useCartStore((s) => s.getItemCount);
  const hasHydrated = useCartStore((s) => s.hasHydrated);

  const wishlistCount = useWishlistStore((s) => s.items.length);
  const currency = useCurrencyStore((s) => s.currency);
  const setCurrency = useCurrencyStore((s) => s.setCurrency);

  const { locale, t } = useEcomI18n();
  // Derive locale prefix from URL (authoritative)
  const segments = pathname.split("/");
  const langPrefix = segments[1] === "ar" ? "ar" : segments[1] === "fr" ? "fr" : "en";

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const count = mounted && hasHydrated ? getItemCount() : 0;
  const wishCount = mounted ? wishlistCount : 0;

  const navLinks = [
    { href: `/${langPrefix}`, label: t.nav.all },
    { href: `/${langPrefix}?category=women`, label: t.nav.women },
    { href: `/${langPrefix}?category=men`, label: t.nav.men },
    { href: `/${langPrefix}?category=footwear`, label: t.nav.footwear },
    { href: `/${langPrefix}?category=tech-accessories`, label: t.nav.accessories },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-titanium-950/95 backdrop-blur-md [-webkit-backdrop-filter:blur(12px)] transition-all">
      {/* Top Notification Bar */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[11px] font-medium py-1.5 px-4 text-center">
        <span>{t.topBanner}</span>
      </div>

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand logo */}
        <div className="flex items-center gap-6 sm:gap-8">
          <Link href={`/${langPrefix}`} className="group flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm transition-transform group-hover:scale-105">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-white">
                {t.storeName}
              </span>
              <span className="text-[10px] text-titanium-400">
                {t.storeSubtitle}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname === link.href.split("?")[0];
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    isActive
                      ? "text-blue-400 bg-white/5 font-semibold"
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
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* URL-based Language Toggle */}
          <LanguageToggle
            currentLocale={locale}
            className="border-white/10 bg-titanium-900 text-titanium-200 hover:border-white/20"
          />

          {/* Currency Switcher */}
          <div className="relative hidden sm:flex items-center">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
              className="bg-titanium-900 border border-white/10 text-titanium-200 text-xs rounded-md px-2.5 py-1.5 pe-6 appearance-none hover:border-white/20 focus:outline-none focus:border-blue-500 cursor-pointer transition-colors"
              title="Select Currency"
              style={{ WebkitAppearance: "none" }}
            >
              {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => (
                <option key={code} value={code} className="bg-titanium-900 text-titanium-100">
                  {CURRENCIES[code].label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute end-2 text-[10px] text-titanium-400">▼</div>
          </div>

          {/* Wishlist button */}
          <Link
            href={`/${langPrefix}/wishlist`}
            className="relative flex h-9 w-9 items-center justify-center rounded-md border border-white/10 bg-titanium-900 text-titanium-300 hover:text-white hover:border-rose-500/50 transition-all"
            title="View Wishlist"
          >
            <Heart className={`h-4 w-4 ${wishCount > 0 ? "text-rose-500 fill-rose-500" : ""}`} />
            {wishCount > 0 && (
              <span className="absolute -top-1.5 -end-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white">
                {wishCount}
              </span>
            )}
          </Link>

          {/* Search Shortcut */}
          <Link
            href={`/${langPrefix}#catalog`}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-white/10 bg-titanium-900 text-titanium-300 hover:text-white hover:border-white/20 transition-colors"
            title="Search Catalog"
          >
            <Search className="h-4 w-4" />
          </Link>

          {/* Cart trigger button */}
          <button
            onClick={toggleDrawer}
            className="relative flex h-9 items-center gap-2 rounded-md bg-blue-600 hover:bg-blue-500 px-3.5 text-xs font-semibold text-white transition-all shadow-sm min-w-[44px] min-h-[44px]"
            aria-label={`Open Cart with ${count} items`}
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">{t.cart.title.split(" ")[0]}</span>
            {count > 0 && (
              <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-white text-blue-600 px-1.5 text-[10px] font-bold">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
