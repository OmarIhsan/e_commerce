import "./globals.css";
import type { Metadata } from "next";
import Header from "@/components/Header";
import CartDrawer from "@/components/CartDrawer";
import { ToastProvider } from "@/components/ToastProvider";
import Link from "next/link";
import { ShieldCheck, Cpu, Terminal, Sparkles, ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "E-Commerce by Omar | Modern Online Store",
  description: "Modern online store featuring live products from Platzi Fake Store API, instant cart management, and seamless checkout flow.",
  openGraph: {
    title: "E-Commerce by Omar | Modern Online Store",
    description: "Modern full-stack online store built with Next.js, TypeScript, and Tailwind CSS. Powered by Platzi Fake Store API.",
    siteName: "E-Commerce by Omar",
    images: [
      {
        url: "https://images.unsplash.com/photo-1544441893-675973e31985?w=1200&q=85&auto=format&fit=crop",
        width: 1200,
        height: 630,
        alt: "E-Commerce by Omar Storefront",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "E-Commerce by Omar",
    description: "Modern online storefront powered by Platzi Fake Store API.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col bg-titanium-950 text-titanium-100 selection:bg-cyber-cyan selection:text-titanium-950 font-sans">
        <ToastProvider>
          {/* Top Telemetry Announcement Bar */}
          <div className="w-full bg-titanium-900/90 border-b border-white/5 py-1.5 px-4 text-center text-[11px] font-mono text-titanium-300 flex items-center justify-center gap-3">
            <span className="flex items-center gap-1 text-cyber-cyan">
              <Sparkles className="w-3 h-3" /> DEMO PLATFORM
            </span>
            <span className="hidden sm:inline text-titanium-600">|</span>
            <span className="hidden sm:inline">USE PROMO CODE <strong className="text-white bg-white/10 px-1.5 py-0.5 rounded">SUMMER15</strong> FOR 15% OFF</span>
            <span className="hidden md:inline text-titanium-600">|</span>
            <span className="hidden md:inline text-cyber-emerald">FREE EXPRESS SHIPPING OVER $75</span>
          </div>

          <Header />
          <CartDrawer />

          <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>

          {/* High-Precision Footer */}
          <footer className="border-t border-white/10 bg-titanium-950/90 text-titanium-400 text-xs font-mono py-12 mt-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-white/5">
                {/* Brand overview */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-subtle bg-gradient-to-br from-cyber-cyan to-cyber-indigo flex items-center justify-center p-0.5">
                      <div className="h-full w-full bg-titanium-950 rounded-[4px] flex items-center justify-center">
                        <Cpu className="w-3.5 h-3.5 text-cyber-cyan" />
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-titanium-100 tracking-wider text-sm">E-COMMERCE BY OMAR</span>
                      <span className="text-[10px] text-titanium-400 font-mono">ONLINE STORE</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-titanium-400 leading-relaxed">
                    Flagship precision e-commerce platform demonstrating sub-second state synchronization, optimistic UX, and automated order invoice state machines.
                  </p>
                  <div className="flex items-center gap-2 text-[10px] text-cyber-emerald pt-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyber-emerald animate-pulse"></span>
                    ALL MOCK GATEWAYS OPERATIONAL
                  </div>
                </div>

                {/* Catalog links */}
                <div className="space-y-2">
                  <div className="font-bold text-titanium-200 uppercase tracking-widest text-[11px]">CATALOG</div>
                  <ul className="space-y-1.5 text-[11px]">
                    <li><Link href="/?category=women" className="hover:text-cyber-cyan transition-colors">Women's Collection</Link></li>
                    <li><Link href="/?category=men" className="hover:text-cyber-cyan transition-colors">Men's Tactical</Link></li>
                    <li><Link href="/?category=footwear" className="hover:text-cyber-cyan transition-colors">Vibram Footwear</Link></li>
                    <li><Link href="/?category=tech-accessories" className="hover:text-cyber-cyan transition-colors">Tech & MagSafe EDC</Link></li>
                  </ul>
                </div>

                {/* System Specs */}
                <div className="space-y-2">
                  <div className="font-bold text-titanium-200 uppercase tracking-widest text-[11px]">CORE STACK</div>
                  <ul className="space-y-1.5 text-[11px] text-titanium-400">
                    <li>Next.js 14 App Router + SSR</li>
                    <li>Zustand + LocalStorage Sync</li>
                    <li>Zod Runtime Schema Validation</li>
                    <li>Framer Motion Micro-Interactions</li>
                    <li>React Hook Form Funnel Engine</li>
                  </ul>
                </div>

                {/* Security & Verification */}
                <div className="space-y-2">
                  <div className="font-bold text-titanium-200 uppercase tracking-widest text-[11px]">VERIFICATION</div>
                  <div className="p-3 rounded-soft bg-titanium-900/60 border border-white/5 space-y-2">
                    <div className="flex items-center gap-2 text-titanium-200 text-[11px]">
                      <ShieldCheck className="w-4 h-4 text-cyber-emerald" />
                      <span>Zero-Real-Charge Sandbox</span>
                    </div>
                    <p className="text-[10px] text-titanium-500">
                      Simulates full end-to-end purchasing lifecycle including QR validation and itemized PDF invoicing.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-titanium-500">
                <p>© {new Date().getFullYear()} E-Commerce by Omar. Portfolio Project.</p>
                <div className="flex items-center gap-6">
                  <Link href="/cart" className="hover:text-titanium-300 transition-colors">Cart</Link>
                  <Link href="/checkout" className="hover:text-titanium-300 transition-colors">Checkout Funnel</Link>
                  <a href="#top" className="hover:text-cyber-cyan transition-colors flex items-center gap-1">
                    Back to Top <ArrowUpRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </ToastProvider>
      </body>
    </html>
  );
}
