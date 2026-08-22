"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Locale = "en" | "ar";

export interface EcomTranslations {
  topBanner: string;
  storeName: string;
  storeSubtitle: string;
  nav: {
    all: string;
    women: string;
    men: string;
    footwear: string;
    accessories: string;
  };
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    shopMen: string;
    shopWomen: string;
    shopFootwear: string;
  };
  benefits: {
    shippingTitle: string;
    shippingDesc: string;
    returnsTitle: string;
    returnsDesc: string;
    securityTitle: string;
    securityDesc: string;
    qualityTitle: string;
    qualityDesc: string;
  };
  filter: {
    searchPlaceholder: string;
    filtersBtn: string;
    resetFilters: string;
    sortFeatured: string;
    sortPriceAsc: string;
    sortPriceDesc: string;
    sortRating: string;
    noProducts: string;
    noProductsDesc: string;
  };
  card: {
    addToCart: string;
    added: string;
    off: string;
    newBadge: string;
  };
  cart: {
    title: string;
    empty: string;
    checkout: string;
    subtotal: string;
    shipping: string;
    free: string;
    promoCode: string;
    apply: string;
  };
}

export const ECOM_DICTIONARIES: Record<Locale, EcomTranslations> = {
  en: {
    topBanner: "🔥 Summer Sale: Use code SUMMER15 for 15% OFF | Free Express Shipping over $75",
    storeName: "OmarStore",
    storeSubtitle: "Online Retail Store",
    nav: {
      all: "All Products",
      women: "Women",
      men: "Men",
      footwear: "Footwear",
      accessories: "Accessories",
    },
    hero: {
      badge: "Summer Collection 2026",
      title: "Discover Everyday Style & Quality Apparel",
      subtitle: "Upgrade your wardrobe with comfortable essentials, trending footwear, and durable accessories. Free shipping on orders over $75 and easy 30-day returns.",
      shopMen: "Shop Men",
      shopWomen: "Shop Women",
      shopFootwear: "Footwear",
    },
    benefits: {
      shippingTitle: "Free Express Shipping",
      shippingDesc: "On all orders over $75",
      returnsTitle: "30-Day Easy Returns",
      returnsDesc: "Hassle-free refunds",
      securityTitle: "Secure Checkout",
      securityDesc: "100% encrypted payment",
      qualityTitle: "Verified Quality",
      qualityDesc: "Curated authentic gear",
    },
    filter: {
      searchPlaceholder: "Search products, clothing, shoes, accessories...",
      filtersBtn: "Filters",
      resetFilters: "Reset Filters",
      sortFeatured: "Sort: Featured",
      sortPriceAsc: "Price: Low to High",
      sortPriceDesc: "Price: High to Low",
      sortRating: "Highest Rated (★)",
      noProducts: "No products found",
      noProductsDesc: "Try adjusting your search keywords or clearing filters to see more items.",
    },
    card: {
      addToCart: "Add",
      added: "Added",
      off: "OFF",
      newBadge: "NEW",
    },
    cart: {
      title: "Shopping Cart",
      empty: "Your shopping cart is empty",
      checkout: "Proceed to Checkout",
      subtotal: "Subtotal",
      shipping: "Shipping",
      free: "Free",
      promoCode: "Promo Code",
      apply: "Apply",
    },
  },
  ar: {
    topBanner: "🔥 عروض الصيف: استخدم كود SUMMER15 لخصم 15% | شحن مجاني للطلبات فوق 75$",
    storeName: "متجر عمر",
    storeSubtitle: "تسوق إلكتروني معتمد",
    nav: {
      all: "جميع المنتجات",
      women: "نساء",
      men: "رجال",
      footwear: "أحذية",
      accessories: "إكسسوارات",
    },
    hero: {
      badge: "تشكيلة صيف 2026",
      title: "اكتشف الأناقة اليومية والأزياء المميزة",
      subtitle: "جدد إطلالتك مع أفضل الملابس العصرية، الأحذية المريحة والإكسسوارات الفاخرة. شحن سريع وإرجاع سهل خلال 30 يوماً.",
      shopMen: "تسوق للرجال",
      shopWomen: "تسوق للنساء",
      shopFootwear: "الأحذية",
    },
    benefits: {
      shippingTitle: "شحن سريع مجاني",
      shippingDesc: "للطلبات فوق 75$",
      returnsTitle: "إرجاع سهل خلال 30 يوم",
      returnsDesc: "استرجاع مالي مضمون",
      securityTitle: "دفع آمن 100%",
      securityDesc: "معاملات مشفرة ومحمية",
      qualityTitle: "جودة أصلية معتمدة",
      qualityDesc: "منتجات مفحوصة ومضمونة",
    },
    filter: {
      searchPlaceholder: "ابحث عن المنتجات، الملابس، الأحذية، الإكسسوارات...",
      filtersBtn: "تصفية",
      resetFilters: "إعادة ضبط",
      sortFeatured: "الترتيب: المميز",
      sortPriceAsc: "السعر: من الأقل للأعلى",
      sortPriceDesc: "السعر: من الأعلى للأقل",
      sortRating: "الأعلى تقييماً (★)",
      noProducts: "لم يتم العثور على منتجات",
      noProductsDesc: "جرب تغيير كلمات البحث أو إعادة ضبط خيارات التصفية.",
    },
    card: {
      addToCart: "إضافة",
      added: "تمت الإضافة",
      off: "خصم",
      newBadge: "جديد",
    },
    cart: {
      title: "سلة المشتريات",
      empty: "سلة المشتريات فارغة",
      checkout: "متابعة الشراء",
      subtotal: "المجموع الفرعي",
      shipping: "الشحن",
      free: "مجاني",
      promoCode: "كود الخصم",
      apply: "تطبيق",
    },
  },
};

interface EcomI18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  t: EcomTranslations;
  dir: "ltr" | "rtl";
}

const STORAGE_KEY = "ecommerce_locale_v1";

const EcomI18nContext = createContext<EcomI18nContextType>({
  locale: "en",
  setLocale: () => {},
  toggleLocale: () => {},
  t: ECOM_DICTIONARIES.en,
  dir: "ltr",
});

export function EcomI18nProvider({
  children,
  initialLocale = "en",
}: {
  children: React.ReactNode;
  initialLocale?: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  useEffect(() => {
    // URL locale is authoritative — keep html attributes in sync
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    try {
      localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      // ignore
    }
  }, [locale]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem(STORAGE_KEY, newLocale);
      document.documentElement.lang = newLocale;
      document.documentElement.dir = newLocale === "ar" ? "rtl" : "ltr";
    } catch {
      // fallback
    }
  };

  const toggleLocale = () => {
    const next: Locale = locale === "en" ? "ar" : "en";
    setLocale(next);
  };

  const value: EcomI18nContextType = {
    locale,
    setLocale,
    toggleLocale,
    t: ECOM_DICTIONARIES[locale] || ECOM_DICTIONARIES.en,
    dir: locale === "ar" ? "rtl" : "ltr",
  };

  return <EcomI18nContext.Provider value={value}>{children}</EcomI18nContext.Provider>;
}

export function useEcomI18n() {
  return useContext(EcomI18nContext);
}
