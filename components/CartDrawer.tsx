"use client";

import { useCartStore } from "@/lib/cartStore";
import { useCurrencyStore } from "@/lib/currencyStore";
import { useEcomI18n } from "@/lib/i18n";
import { AnimatePresence, motion } from "framer-motion";
import { X, Trash2, Plus, Minus, ArrowRight, ArrowLeft, Tag, ShieldCheck, Sparkles, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
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
  const { dir, t } = useEcomI18n();
  const isRtl = dir === "rtl";
  const pathname = usePathname();
  const locale = pathname.split("/")[1] === "ar" ? "ar" : "en";

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
            className="fixed inset-0 bg-black/70 backdrop-blur-xs"
          />

          <div className={`fixed inset-y-0 ${isRtl ? "left-0 pr-10" : "right-0 pl-10"} max-w-full flex`}>
            {/* Drawer panel */}
            <motion.div
              initial={{ x: isRtl ? "-100%" : "100%" }}
              animate={{ x: 0 }}
              exit={{ x: isRtl ? "-100%" : "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={`w-screen max-w-md bg-titanium-950/98 text-titanium-100 flex flex-col h-[100dvh] shadow-2xl backdrop-blur-2xl border-white/10 ${
                isRtl ? "border-r" : "border-l"
              }`}
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
                <div className="flex items-center gap-2.5">
                  <ShoppingBag className="w-5 h-5 text-blue-400" />
                  <h2 className="font-bold text-sm tracking-wide text-white">
                    {t.cart.title} ({items.reduce((s, i) => s + i.qty, 0)})
                  </h2>
                </div>
                <button
                  onClick={closeDrawer}
                  className="min-h-[44px] min-w-[44px] p-2 rounded-lg text-titanium-400 hover:text-white hover:bg-white/5 transition-colors flex items-center justify-center"
                  aria-label="Close cart"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Free Shipping Progress Meter */}
              <div className="px-6 py-3 bg-titanium-900/60 border-b border-white/5">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-titanium-300">
                    {subtotal >= FREE_SHIPPING_THRESHOLD ? (
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" /> Free Express Shipping Unlocked!
                      </span>
                    ) : (
                      <span>
                        Add <strong className="text-blue-400">{formatPrice(remainingForFreeShip)}</strong> for Free Shipping
                      </span>
                    )}
                  </span>
                  <span className="text-titanium-400 font-medium">{Math.round(progress)}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-titanium-800 overflow-hidden">
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
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 text-titanium-500">
                      <ShoppingBag className="w-8 h-8 opacity-40" />
                    </div>
                    <h3 className="text-sm font-semibold text-white mb-1">{t.cart.empty}</h3>
                    <p className="text-xs text-titanium-400 max-w-xs mb-6">
                      Explore our lifestyle catalog and add your favourite pieces.
                    </p>
                    <button
                      onClick={closeDrawer}
                      className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-colors"
                    >
                      {t.nav.all}
                    </button>
                  </div>
                ) : (
                  items.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-xl bg-titanium-900/60 border border-white/5 flex gap-3.5 items-center group"
                    >
                      {/* Image Thumbnail */}
                      <div className="w-16 h-16 rounded-lg bg-titanium-950 shrink-0 overflow-hidden border border-white/5 relative">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-white truncate">
                          {item.name}
                        </h4>
                        <div className="text-[11px] text-titanium-400 mt-0.5">
                          {item.size && <span>Size: {item.size} </span>}
                          {item.color && <span>• {item.color}</span>}
                        </div>
                        <div className="font-semibold text-blue-400 text-xs mt-1">
                          {formatPrice(item.price)}
                        </div>
                      </div>

                      {/* Quantity Stepper (44x44px touch targets) */}
                      <div className="flex items-center gap-1 border border-white/10 rounded-lg p-0.5 bg-titanium-950">
                        <button
                          onClick={() => handleUpdateQty(item.id, item.qty, -1)}
                          className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-md text-titanium-400 hover:text-white hover:bg-white/5 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-6 text-center text-xs font-semibold text-white">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => handleUpdateQty(item.id, item.qty, 1)}
                          className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-md text-titanium-400 hover:text-white hover:bg-white/5 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Delete */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="min-h-[44px] min-w-[44px] p-2 text-titanium-500 hover:text-rose-400 transition-colors flex items-center justify-center"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Footer Calculations & Checkout */}
              {items.length > 0 && (
                <div className="p-5 border-t border-white/10 bg-titanium-900/80 space-y-4">
                  {/* Promo Input */}
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 text-titanium-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                        placeholder={t.cart.promoCode}
                        className="w-full pl-9 pr-3 py-2 rounded-lg bg-titanium-950 border border-white/10 text-xs text-white placeholder:text-titanium-600 focus:outline-none focus:border-blue-500 uppercase"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isApplyingPromo || !promoInput.trim()}
                      className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-semibold disabled:opacity-40 transition-colors"
                    >
                      {t.cart.apply}
                    </button>
                  </form>

                  {/* Summary rows */}
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-titanium-400">
                      <span>{t.cart.subtotal}</span>
                      <span className="text-white font-semibold">{formatPrice(subtotal)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-emerald-400">
                        <span>Discount ({appliedPromo?.code})</span>
                        <span>-{formatPrice(discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-titanium-400">
                      <span>{t.cart.shipping}</span>
                      <span className="text-emerald-400 font-semibold">
                        {shipping === 0 ? t.cart.free : formatPrice(shipping)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-white/10">
                      <span>Total</span>
                      <span className="text-blue-400 text-base">{formatPrice(total)}</span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <Link
                    href={`/${locale}/checkout`}
                    onClick={closeDrawer}
                    className="w-full min-h-[48px] rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all group"
                  >
                    <span>{t.cart.checkout}</span>
                    <CheckoutIcon className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
