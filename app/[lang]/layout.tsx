import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { EcomI18nProvider } from "@/lib/i18n";
import { Locale, ECOM_DICTIONARIES } from "@/lib/i18nDict";
import Header from "@/components/Header";
import CartDrawer from "@/components/CartDrawer";
import { ToastProvider } from "@/components/ToastProvider";
import Link from "next/link";
import { ShieldCheck, ShoppingBag } from "lucide-react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "ar" }, { lang: "fr" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (lang === "ar") {
    return {
      title: "متجر عمر | تسوق إلكتروني سهل وسريع",
      description: "تسوق ملابس وأحذية وإكسسوارات بأسعار مناسبة وشحن مجاني وسريع للطلبات فوق 75$.",
    };
  }
  if (lang === "fr") {
    return {
      title: "OmarStore | Boutique en ligne facile et rapide",
      description: "Achetez des vêtements, chaussures et accessoires au meilleur prix avec livraison gratuite dès 75$.",
    };
  }
  return {
    title: "OmarStore | Easy Everyday Online Store",
    description: "Shop comfortable clothes, footwear, and accessories with free fast delivery on orders over $75.",
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
  const currentLang = (["en", "ar", "fr"].includes(lang) ? lang : "en") as Locale;
  const dir = currentLang === "ar" ? "rtl" : "ltr";
  const dict = ECOM_DICTIONARIES[currentLang] || ECOM_DICTIONARIES.en;

  return (
    <html lang={currentLang} dir={dir} className={`dark ${inter.variable}`}>
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
        <EcomI18nProvider initialLocale={currentLang}>
          <ToastProvider>
            <Header />
            <CartDrawer />
            <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </main>

            {/* Multilingual Retail Footer */}
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
                      {dict.footer.about}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-white uppercase text-xs tracking-wider">
                      {dict.footer.quickLinks}
                    </h4>
                    <ul className="space-y-1.5 text-xs">
                      <li>
                        <Link href={`/${currentLang}`} className="hover:text-blue-400 transition-colors">
                          {dict.nav.all}
                        </Link>
                      </li>
                      <li>
                        <Link href={`/${currentLang}?category=men`} className="hover:text-blue-400 transition-colors">
                          {dict.nav.men}
                        </Link>
                      </li>
                      <li>
                        <Link href={`/${currentLang}?category=women`} className="hover:text-blue-400 transition-colors">
                          {dict.nav.women}
                        </Link>
                      </li>
                      <li>
                        <Link href={`/${currentLang}?category=footwear`} className="hover:text-blue-400 transition-colors">
                          {dict.nav.footwear}
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-white uppercase text-xs tracking-wider">
                      {dict.footer.support}
                    </h4>
                    <ul className="space-y-1.5 text-xs">
                      <li>
                        <Link href={`/${currentLang}/cart`} className="hover:text-blue-400 transition-colors">
                          {dict.cart.title}
                        </Link>
                      </li>
                      <li>
                        <Link href={`/${currentLang}/wishlist`} className="hover:text-blue-400 transition-colors">
                          {dict.wishlist.title}
                        </Link>
                      </li>
                      <li>
                        <Link href={`/${currentLang}/checkout`} className="hover:text-blue-400 transition-colors">
                          {dict.checkout.title}
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-white uppercase text-xs tracking-wider">
                      {dict.footer.guarantee}
                    </h4>
                    <div className="p-3 rounded-lg bg-titanium-950 border border-white/5 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-xs">
                        <ShieldCheck className="w-4 h-4" />
                        <span>SSL Encrypted</span>
                      </div>
                      <p className="text-[11px] text-titanium-400">
                        {dict.footer.guaranteeText}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-titanium-500">
                  <p>© {new Date().getFullYear()} OmarStore. {dict.footer.rights}</p>
                  <p>{dict.footer.platform}</p>
                </div>
              </div>
            </footer>
          </ToastProvider>
        </EcomI18nProvider>
      </body>
    </html>
  );
}
