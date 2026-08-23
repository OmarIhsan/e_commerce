"use client";

import { useCartStore } from "@/lib/cartStore";
import { useCurrencyStore } from "@/lib/currencyStore";
import { useEcomI18n } from "@/lib/i18n";
import { Trash2, Plus, Minus, ArrowRight, ArrowLeft, Tag, ShieldCheck, Sparkles, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ToastProvider";
import { motion, AnimatePresence } from "framer-motion";

const FREE_SHIPPING_THRESHOLD = 75;

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const updateQty = useCartStore((s) => s.updateQty);
  const removeItem = useCartStore((s) => s.removeItem);
  const clearCart = useCartStore((s) => s.clearCart);
  const appliedPromo = useCartStore((s) => s.appliedPromo);
  const applyPromoCode = useCartStore((s) => s.applyPromoCode);
  const removePromoCode = useCartStore((s) => s.removePromoCode);
  const hasHydrated = useCartStore((s) => s.hasHydrated);

  const getSubtotal = useCartStore((s) => s.getSubtotal);
  const getDiscountAmount = useCartStore((s) => s.getDiscountAmount);
  const getShippingCost = useCartStore((s) => s.getShippingCost);
  const getGrandTotal = useCartStore((s) => s.getGrandTotal);

  const formatPrice = useCurrencyStore((s) => s.formatPrice);
  const { locale, dir, t } = useEcomI18n();
  const isRtl = dir === "rtl";

  const { success, error } = useToast();
  const [promoInput, setPromoInput] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const subtotal = getSubtotal();
  const discount = getDiscountAmount();
  const shipping = getShippingCost();
  const total = getGrandTotal();
  const tax = total > 0 ? total - (subtotal - discount + shipping) : 0;

  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const remainingForFreeShip = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyPromoCode(promoInput);
    if (res.success) {
      success(res.message);
      setPromoInput("");
    } else {
      error(res.message);
    }
  };

  const handleQtyChange = (itemId: string, currentQty: number, change: number) => {
    const next = currentQty + change;
    const res = updateQty(itemId, next);
    if (!res.success && res.message) {
      error(res.message);
    }
  };

  if (!mounted || !hasHydrated) {
    return (
      <div className="py-24 text-center text-xs text-titanium-400">
        Loading...
      </div>
    );
  }

  const CheckoutArrow = isRtl ? ArrowLeft : ArrowRight;

  if (items.length === 0) {
    return (
      <div className="p-12 rounded-2xl bg-titanium-900 border border-white/10 text-center max-w-xl mx-auto space-y-6 my-8">
        <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-titanium-400">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-xl font-bold text-white">
            {t.cart.empty}
          </h1>
          <p className="text-xs text-titanium-400 leading-relaxed">
            {t.cart.emptyDesc}
          </p>
        </div>
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-colors"
        >
          <span>{t.cart.startShopping}</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {t.cart.title} ({items.reduce((s, i) => s + i.qty, 0)})
          </h1>
          <p className="text-xs text-titanium-400 mt-1">
            {t.storeSubtitle}
          </p>
        </div>

        <button
          onClick={clearCart}
          className="text-xs text-titanium-400 hover:text-rose-400 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>{t.cart.clearCart}</span>
        </button>
      </div>

      {/* Free Shipping Progress bar */}
      <div className="p-4 rounded-xl bg-titanium-900 border border-white/10">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-titanium-200">
            {subtotal >= FREE_SHIPPING_THRESHOLD ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> {t.cart.freeShippingBar}
              </span>
            ) : (
              <span>
                {t.cart.unlockFreeShipping} (<strong className="text-blue-400">{formatPrice(remainingForFreeShip)}</strong>)
              </span>
            )}
          </span>
          <span className="font-bold text-titanium-300">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-titanium-800 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
            className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 rounded-full"
          />
        </div>
      </div>

      {/* Main Grid: Items on Left, Summary on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Cart items */}
        <div className="lg:col-span-8 space-y-4">
          <AnimatePresence mode="popLayout">
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-4 sm:p-5 rounded-2xl bg-titanium-900 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between border border-white/10"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-titanium-950 shrink-0 border border-white/10">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <span className="text-[10px] text-blue-400 uppercase tracking-wider font-semibold block">
                      {item.brand}
                    </span>
                    <Link
                      href={`/${locale}/product/${item.sku}`}
                      className="font-semibold text-sm text-white hover:text-blue-400 transition-colors block truncate"
                    >
                      {item.name}
                    </Link>
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-titanium-400">
                      {item.size && <span>{item.size}</span>}
                      {item.color && <span>• {item.color}</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-6 sm:shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                  {/* Quantity Stepper */}
                  <div className="flex items-center rounded-lg bg-titanium-950 border border-white/10">
                    <button
                      onClick={() => handleQtyChange(item.id, item.qty, -1)}
                      className="p-2 text-titanium-400 hover:text-white transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-white">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => handleQtyChange(item.id, item.qty, 1)}
                      disabled={item.qty >= item.maxInventory}
                      className="p-2 text-titanium-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Price */}
                  <div className="text-end">
                    <div className="text-base font-bold text-white">
                      {formatPrice(item.price * item.qty)}
                    </div>
                    {item.qty > 1 && (
                      <div className="text-[10px] text-titanium-400">
                        {formatPrice(item.price)} {t.cart.each}
                      </div>
                    )}
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-titanium-500 hover:text-rose-400 transition-colors p-1"
                    title={t.card.removeWishlist}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Right Column: Order Summary & Coupon */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-2xl bg-titanium-900 border border-white/10 space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-white border-b border-white/10 pb-3">
              {t.checkout.orderSummary}
            </h2>

            {/* Promo Code Form */}
            {appliedPromo ? (
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-1">
                <div className="flex items-center justify-between text-emerald-400 font-bold">
                  <span className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" /> {appliedPromo.code}
                  </span>
                  <button
                    onClick={removePromoCode}
                    className="text-titanium-400 hover:text-rose-400 underline text-[10px]"
                  >
                    {t.cart.remove}
                  </button>
                </div>
                <div className="text-[11px] text-titanium-300">
                  {appliedPromo.description}
                </div>
              </div>
            ) : (
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute start-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-titanium-400" />
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder={t.cart.promoCode}
                    className="w-full ps-9 pe-3 py-2 text-xs titanium-input rounded-lg uppercase"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!promoInput.trim()}
                  className="px-3.5 py-2 rounded-lg btn-titanium text-xs uppercase font-semibold disabled:opacity-40"
                >
                  {t.cart.apply}
                </button>
              </form>
            )}

            {/* Calculations Breakdown */}
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-titanium-300">
                <span>{t.cart.subtotal}</span>
                <span className="font-semibold text-white">{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>{t.cart.discount} ({appliedPromo?.code})</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-titanium-300">
                <span>{t.cart.shipping}</span>
                <span>{shipping === 0 ? <strong className="text-emerald-400">{t.cart.free}</strong> : formatPrice(shipping)}</span>
              </div>
              {tax > 0 && (
                <div className="flex justify-between text-titanium-300">
                  <span>{t.cart.tax}</span>
                  <span>{formatPrice(tax)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-white pt-3 border-t border-white/10">
                <span>{t.cart.total}</span>
                <span className="text-xl text-blue-400">{formatPrice(total)}</span>
              </div>
            </div>

            {/* Checkout Link */}
            <Link
              href={`/${locale}/checkout`}
              className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors min-h-[44px]"
            >
              <span>{t.cart.checkout}</span>
              <CheckoutArrow className="w-4 h-4" />
            </Link>

            <div className="flex items-center justify-center gap-2 text-[11px] text-titanium-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.benefits.securityTitle} • {t.benefits.returnsTitle}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
