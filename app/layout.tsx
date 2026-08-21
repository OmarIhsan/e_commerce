import "./globals.css";
import type { Metadata } from "next";
import Header from "@/components/Header";
import CartDrawer from "@/components/CartDrawer";
import { ToastProvider } from "@/components/ToastProvider";
import { EcomI18nProvider } from "@/lib/i18n";
import Link from "next/link";
import { ShieldCheck, ShoppingBag, ArrowUpRight, Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "OmarStore | Modern Online Store",
  description: "Modern online store featuring live products, instant shopping cart management, and seamless checkout flow.",
  openGraph: {
    title: "OmarStore | Modern Online Store",
    description: "Modern full-stack online store built with Next.js, TypeScript, and Tailwind CSS.",
    siteName: "OmarStore",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body className="min-h-[100dvh] flex flex-col bg-titanium-950 text-titanium-100 selection:bg-blue-600 selection:text-white font-sans antialiased">
        <EcomI18nProvider>
          <ToastProvider>
            <Header />
            <CartDrawer />

            <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </main>

            {/* Clean Retail Footer */}
            <footer className="border-t border-white/10 bg-titanium-900 text-titanium-400 text-xs py-12 mt-16">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-white/5">
                  {/* Col 1 */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 font-bold text-white text-base">
                      <div className="w-7 h-7 rounded-md bg-blue-600 text-white flex items-center justify-center">
                        <ShoppingBag className="w-4 h-4" />
                      </div>
                      <span>Omar<span className="text-blue-400">Store</span></span>
                    </div>
                    <p className="text-xs text-titanium-400 leading-relaxed">
                      Modern online shopping storefront with fast express delivery, verified customer reviews, and secure checkout.
                    </p>
                  </div>

                  {/* Col 2 */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-white uppercase text-xs tracking-wider">Quick Links</h4>
                    <ul className="space-y-1.5 text-xs">
                      <li><Link href="/" className="hover:text-blue-400 transition-colors">All Products</Link></li>
                      <li><Link href="/?category=men" className="hover:text-blue-400 transition-colors">Men&apos;s Apparel</Link></li>
                      <li><Link href="/?category=women" className="hover:text-blue-400 transition-colors">Women&apos;s Apparel</Link></li>
                      <li><Link href="/?category=footwear" className="hover:text-blue-400 transition-colors">Footwear</Link></li>
                    </ul>
                  </div>

                  {/* Col 3 */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-white uppercase text-xs tracking-wider">Customer Support</h4>
                    <ul className="space-y-1.5 text-xs">
                      <li><Link href="/cart" className="hover:text-blue-400 transition-colors">Shopping Cart</Link></li>
                      <li><Link href="/wishlist" className="hover:text-blue-400 transition-colors">Saved Wishlist</Link></li>
                      <li><Link href="/checkout" className="hover:text-blue-400 transition-colors">Checkout</Link></li>
                    </ul>
                  </div>

                  {/* Col 4 */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-white uppercase text-xs tracking-wider">Security &amp; Guarantee</h4>
                    <div className="p-3 rounded-lg bg-titanium-950 border border-white/5 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-xs">
                        <ShieldCheck className="w-4 h-4" /> 256-Bit SSL Encrypted
                      </div>
                      <p className="text-[11px] text-titanium-400">
                        Safe payments with 30-day money-back guarantee.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-titanium-500">
                  <p>&copy; {new Date().getFullYear()} OmarStore. All rights reserved.</p>
                  <p>Developed with Next.js &amp; Tailwind CSS.</p>
                </div>
              </div>
            </footer>
          </ToastProvider>
        </EcomI18nProvider>
      </body>
    </html>
  );
}
