"use client";

import { useCartStore } from "@/lib/cartStore";
import { useCurrencyStore } from "@/lib/currencyStore";
import { useEcomI18n } from "@/lib/i18n";
import { AnimatePresence, motion } from "framer-motion";
import { X, Trash2, Plus, Minus, ArrowRight, ArrowLeft, Tag, ShieldCheck, Sparkles, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ToastProvider";

const FREE_SHIPPING_THRESHOLD = 75;

export default function CartDrawer() {
  const isDrawerOpen = useCartStore((s) => s.isDrawerOpen);
  const closeDrawer = useCartStore((s) => s.closeDrawer);
  const items = useCartStore((s) => s.items);
  const updateQty = useCartStore((s) => s.updateQty);
  const removeItem = useCartStore((s) => s.removeItem);
  const appliedPromo = useCartStore((s) => s.appliedPromo);
  const applyPromoCode = useCartStore((s) => s.applyPromoCode);
  const removePromoCode = useCartStore((s) => s.removePromoCode);

  const getSubtotal = useCartStore((s) => s.getSubtotal);
  const getDiscountAmount = useCartStore((s) => s.getDiscountAmount);
  const getShippingCost = useCartStore((s) => s.getShippingCost);
  const getGrandTotal = useCartStore((s) => s.getGrandTotal);

  const formatPrice = useCurrencyStore((s) => s.formatPrice);
  const { dir, locale, t } = useEcomI18n();
  const isRtl = dir === "rtl";

  const { success, error } = useToast();
  const [promoInput, setPromoInput] = useState("");
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  const subtotal = getSubtotal();
  const discount = getDiscountAmount();
  const shipping = getShippingCost();
  const total = getGrandTotal();

  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const remainingForFreeShip = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isDrawerOpen) {
        closeDrawer();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDrawerOpen, closeDrawer]);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    setIsApplyingPromo(true);
    const res = applyPromoCode(promoInput);
    if (res.success) {
      success(res.message);
      setPromoInput("");
    } else {
      error(res.message);
    }
    setIsApplyingPromo(false);
  };

  const handleUpdateQty = (itemId: string, currentQty: number, change: number) => {
    const nextQty = currentQty + change;
    const res = updateQty(itemId, nextQty);
    if (!res.success && res.message) {
      error(res.message);
    }
  };

  const CheckoutIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" dir={isRtl ? "rtl" : "ltr"}>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeDrawer}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />

          <div className={`fixed inset-y-0 ${isRtl ? "left-0 pr-10" : "right-0 pl-10"} max-w-full flex`}>
            {/* Drawer panel */}
            <motion.div
              initial={{ x: isRtl ? "-100%" : "100%" }}
              animate={{ x: 0 }}
              exit={{ x: isRtl ? "-100%" : "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={`w-screen max-w-md bg-white dark:bg-titanium-950 text-slate-900 dark:text-titanium-100 flex flex-col h-[100dvh] shadow-2xl border-slate-200 dark:border-white/10 ${
                isRtl ? "border-r" : "border-l"
              }`}
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-slate-200 dark:border-white/10 flex items-center justify-between bg-slate-50/50 dark:bg-white/[0.02]">
                <div className="flex items-center gap-2.5">
                  <ShoppingBag className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h2 className="font-bold text-sm tracking-wide text-slate-900 dark:text-white">
                    {t.cart.title} ({items.reduce((s, i) => s + i.qty, 0)})
                  </h2>
                </div>
                <button
                  onClick={closeDrawer}
                  className="min-h-[44px] min-w-[44px] p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:text-titanium-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors flex items-center justify-center cursor-pointer"
                  aria-label="Close cart"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Free Shipping Progress Meter */}
              <div className="px-6 py-3 bg-slate-50 dark:bg-titanium-900/60 border-b border-slate-200 dark:border-white/5">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-600 dark:text-titanium-300">
                    {subtotal >= FREE_SHIPPING_THRESHOLD ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" /> {t.cart.freeShippingBar}
                      </span>
                    ) : (
                      <span>
                        {t.cart.unlockFreeShipping} (<strong className="text-blue-600 dark:text-blue-400">{formatPrice(remainingForFreeShip)}</strong>)
                      </span>
                    )}
                  </span>
                  <span className="text-slate-500 dark:text-titanium-400 font-medium">{Math.round(progress)}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-titanium-800 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full"
                  />
                </div>
              </div>

              {/* Item List */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4" style={{ scrollbarWidth: "thin" }}>
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center mb-4 text-slate-400 dark:text-titanium-500">
                      <ShoppingBag className="w-8 h-8 opacity-40" />
                    </div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">{t.cart.empty}</h3>
                    <p className="text-xs text-slate-500 dark:text-titanium-400 max-w-xs mb-6">
                      {t.cart.emptyDesc}
                    </p>
                    <button
                      onClick={closeDrawer}
                      className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                    >
                      {t.cart.startShopping}
                    </button>
                  </div>
                ) : (
                  items.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-xl bg-slate-50 dark:bg-titanium-900/60 border border-slate-200 dark:border-white/5 flex gap-3.5 items-center group"
                    >
                      {/* Image Thumbnail */}
                      <div className="w-16 h-16 rounded-lg bg-slate-200 dark:bg-titanium-950 shrink-0 overflow-hidden border border-slate-200 dark:border-white/5 relative">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {item.name}
                        </h4>
                        <div className="text-[11px] text-slate-500 dark:text-titanium-400 mt-0.5">
                          {item.size && <span>{item.size} </span>}
                          {item.color && <span>• {item.color}</span>}
                        </div>
                        <div className="font-semibold text-blue-600 dark:text-blue-400 text-xs mt-1">
                          {formatPrice(item.price)}
                        </div>
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex items-center gap-1 border border-slate-200 dark:border-white/10 rounded-lg p-0.5 bg-white dark:bg-titanium-950">
                        <button
                          onClick={() => handleUpdateQty(item.id, item.qty, -1)}
                          className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-md text-slate-500 hover:text-slate-900 dark:text-titanium-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-6 text-center text-xs font-semibold text-slate-900 dark:text-white">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => handleUpdateQty(item.id, item.qty, 1)}
                          className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-md text-slate-500 hover:text-slate-900 dark:text-titanium-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Delete */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="min-h-[44px] min-w-[44px] p-2 text-slate-400 hover:text-rose-500 dark:text-titanium-500 dark:hover:text-rose-400 transition-colors flex items-center justify-center cursor-pointer"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Drawer Footer & Checkout Action */}
              {items.length > 0 && (
                <div className="p-6 border-t border-slate-200 dark:border-white/10 bg-slate-50/80 dark:bg-white/[0.02] space-y-4">
                  {/* Promo Input */}
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute start-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 dark:text-titanium-400" />
                      <input
                        type="text"
                        placeholder={t.cart.promoCode}
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                        className="w-full ps-9 pe-3 py-2 text-xs rounded-lg bg-white dark:bg-titanium-900 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-titanium-100 focus:outline-none focus:border-blue-500 uppercase"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isApplyingPromo || !promoInput.trim()}
                      className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/15 text-slate-800 dark:text-white text-xs font-semibold transition-colors disabled:opacity-40 cursor-pointer"
                    >
                      {t.cart.apply}
                    </button>
                  </form>

                  {/* Applied promo badge */}
                  {appliedPromo && (
                    <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-400">
                      <span className="font-semibold">
                        {appliedPromo.code} {appliedPromo.discountType === "percentage" ? `(-${appliedPromo.value}%)` : appliedPromo.discountType === "fixed" ? `(-$${appliedPromo.value})` : ""}
                      </span>
                      <button
                        onClick={removePromoCode}
                        className="text-xs hover:underline cursor-pointer"
                      >
                        {t.cart.remove}
                      </button>
                    </div>
                  )}

                  {/* Cost breakdown */}
                  <div className="space-y-1.5 text-xs text-slate-600 dark:text-titanium-400">
                    <div className="flex justify-between">
                      <span>{t.cart.subtotal}</span>
                      <span className="font-medium text-slate-800 dark:text-titanium-200">{formatPrice(subtotal)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                        <span>{t.cart.discount}</span>
                        <span>-{formatPrice(discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>{t.cart.shipping}</span>
                      <span>
                        {shipping === 0 ? (
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{t.cart.free}</span>
                        ) : (
                          formatPrice(shipping)
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between font-bold text-sm text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-white/10">
                      <span>{t.cart.total}</span>
                      <span className="text-blue-600 dark:text-blue-400">{formatPrice(total)}</span>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="space-y-2 pt-1">
                    <Link
                      href={`/${locale}/checkout`}
                      onClick={closeDrawer}
                      className="w-full py-3 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
                    >
                      <span>{t.cart.checkout}</span>
                      <CheckoutIcon className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`/${locale}/cart`}
                      onClick={closeDrawer}
                      className="w-full py-2.5 px-4 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-titanium-300 text-xs font-semibold text-center block transition-colors cursor-pointer"
                    >
                      {t.cart.title}
                    </Link>
                  </div>

                  {/* Trust badge */}
                  <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 dark:text-titanium-500 pt-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>{t.benefits.securityTitle} • {t.benefits.returnsTitle}</span>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
