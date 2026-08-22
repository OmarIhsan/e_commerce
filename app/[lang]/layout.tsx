import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { EcomI18nProvider } from "@/lib/i18n";
import Header from "@/components/Header";
import CartDrawer from "@/components/CartDrawer";
import { ToastProvider } from "@/components/ToastProvider";
import Link from "next/link";
import { ShieldCheck, ShoppingBag } from "lucide-react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

type Locale = "en" | "ar";

export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "ar" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (lang === "ar") {
    return {
      title: "متجر عمر | تسوق إلكتروني معتمد",
      description: "تسوق أونلاين مع أفضل المنتجات وأسعار مناسبة وشحن سريع لباب بيتك.",
    };
  }
  return {
    title: "OmarStore | Modern Online Store",
    description: "Modern online store featuring live products, instant shopping cart, and seamless checkout.",
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dir = lang === "ar" ? "rtl" : "ltr";

  return (
    <html lang={lang} dir={dir} className={`dark ${inter.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <style>{`
          * { -webkit-tap-highlight-color: transparent; }
          ::-webkit-scrollbar { width: 6px; }
          ::-webkit-scrollbar-track { background: transparent; }
          ::-webkit-scrollbar-thumb { background: rgba(100,116,139,0.4); border-radius: 3px; }
          * { scrollbar-width: thin; scrollbar-color: rgba(100,116,139,0.4) transparent; }
        `}</style>
      </head>
      <body className="min-h-[100dvh] flex flex-col bg-titanium-950 text-titanium-100 selection:bg-blue-600 selection:text-white font-sans antialiased">
        <EcomI18nProvider initialLocale={lang}>
          <ToastProvider>
            <Header />
            <CartDrawer />
            <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </main>

            {/* Retail Footer */}
            <footer className="border-t border-white/10 bg-titanium-900 text-titanium-400 text-xs py-12 mt-16">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-white/5">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 font-bold text-white text-base">
                      <div className="w-7 h-7 rounded-md bg-blue-600 text-white flex items-center justify-center">
                        <ShoppingBag className="w-4 h-4" />
                      </div>
                      <span>Omar<span className="text-blue-400">Store</span></span>
                    </div>
                    <p className="text-xs text-titanium-400 leading-relaxed">
                      {lang === "ar"
                        ? "متجر إلكتروني متكامل مع توصيل سريع وضمان الجودة."
                        : "Modern online shopping with fast delivery and verified quality."}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-white uppercase text-xs tracking-wider">
                      {lang === "ar" ? "روابط سريعة" : "Quick Links"}
                    </h4>
                    <ul className="space-y-1.5 text-xs">
                      <li><Link href={`/${lang}`} className="hover:text-blue-400 transition-colors">{lang === "ar" ? "جميع المنتجات" : "All Products"}</Link></li>
                      <li><Link href={`/${lang}?category=men`} className="hover:text-blue-400 transition-colors">{lang === "ar" ? "رجال" : "Men's Apparel"}</Link></li>
                      <li><Link href={`/${lang}?category=women`} className="hover:text-blue-400 transition-colors">{lang === "ar" ? "نساء" : "Women's Apparel"}</Link></li>
                      <li><Link href={`/${lang}?category=footwear`} className="hover:text-blue-400 transition-colors">{lang === "ar" ? "أحذية" : "Footwear"}</Link></li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-white uppercase text-xs tracking-wider">
                      {lang === "ar" ? "دعم العملاء" : "Customer Support"}
                    </h4>
                    <ul className="space-y-1.5 text-xs">
                      <li><Link href={`/${lang}/cart`} className="hover:text-blue-400 transition-colors">{lang === "ar" ? "سلة المشتريات" : "Shopping Cart"}</Link></li>
                      <li><Link href={`/${lang}/wishlist`} className="hover:text-blue-400 transition-colors">{lang === "ar" ? "قائمة الرغبات" : "Saved Wishlist"}</Link></li>
                      <li><Link href={`/${lang}/checkout`} className="hover:text-blue-400 transition-colors">{lang === "ar" ? "إتمام الشراء" : "Checkout"}</Link></li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-white uppercase text-xs tracking-wider">
                      {lang === "ar" ? "الأمان والضمان" : "Security & Guarantee"}
                    </h4>
                    <div className="p-3 rounded-lg bg-titanium-950 border border-white/5 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-xs">
                        <ShieldCheck className="w-4 h-4" />
                        {lang === "ar" ? "تشفير 256-Bit SSL" : "256-Bit SSL Encrypted"}
                      </div>
                      <p className="text-[11px] text-titanium-400">
                        {lang === "ar" ? "دفع آمن مع ضمان استرجاع 30 يوم." : "Safe payments with 30-day money-back guarantee."}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-titanium-500">
                  <p>© {new Date().getFullYear()} OmarStore. {lang === "ar" ? "جميع الحقوق محفوظة." : "All rights reserved."}</p>
                  <p>Built with Next.js & Tailwind CSS.</p>
                </div>
              </div>
            </footer>
          </ToastProvider>
        </EcomI18nProvider>
      </body>
    </html>
  );
}
