import "./globals.css";
import type { Metadata } from "next";
import MiniCart from "@/components/MiniCart";

export const metadata: Metadata = {
  title: "E‑Commerce Portfolio",
  description: "Premium, performant, and accessible e‑commerce experience.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-paper text-ink">
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-ink text-paper px-3 py-2 rounded-subtle">Skip to content</a>
        <header className="sticky top-0 z-50 bg-paper/80 backdrop-blur border-b border-mist">
          <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
            <div className="font-semibold">Store</div>
            <nav className="flex items-center gap-6 text-sm">
              <a href="/" className="hover:text-indigo">Home</a>
              <a href="/category/women" className="hover:text-indigo">Women</a>
              <a href="/category/men" className="hover:text-indigo">Men</a>
              <a href="/category/accessories" className="hover:text-indigo">Accessories</a>
              <a href="/cart" className="hover:text-indigo">Cart</a>
              <MiniCart />
            </nav>
          </div>
        </header>
        <main id="main" className="mx-auto max-w-6xl px-4 py-8">{children}</main>
        <footer className="border-t border-mist py-8 text-sm">
          <div className="mx-auto max-w-6xl px-4 flex items-center justify-between">
            <p>© Portfolio Demo — No real payments.</p>
            <a href="/about" className="hover:text-indigo">About</a>
          </div>
        </footer>
      </body>
    </html>
  );
}
