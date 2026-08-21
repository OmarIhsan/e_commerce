"use client";

import { useCartStore } from "@/lib/cartStore";
import { formatCurrency, FREE_SHIPPING_THRESHOLD } from "@/lib/utils";
import { Trash2, Plus, Minus, ArrowRight, Tag, ShieldCheck, Sparkles, ShoppingBag, ArrowLeft, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ToastProvider";
import { motion, AnimatePresence } from "framer-motion";

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
      <div className="py-24 text-center font-mono text-xs text-titanium-400">
        LOADING DISPATCH REPOSITORY...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="glass-panel p-12 rounded-card text-center max-w-xl mx-auto space-y-6 my-8">
        <div className="w-16 h-16 rounded-pill bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-titanium-400">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-xl font-bold font-mono uppercase tracking-wider text-titanium-100">
            YOUR CART IS CURRENTLY EMPTY
          </h1>
          <p className="text-xs text-titanium-400 leading-relaxed">
            No items in active queue. Explore our catalog of precision apparel and EDC gear.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-subtle btn-cyber-primary font-mono text-xs uppercase tracking-wider font-bold shadow-glow"
        >
          <ArrowLeft className="w-4 h-4" /> Explore Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-titanium-100">
            Dispatch Queue &amp; Cart
          </h1>
          <p className="text-xs font-mono text-titanium-400 mt-1">
            Review your items and adjust quantities before entering the 3-step checkout funnel.
          </p>
        </div>

        <button
          onClick={clearCart}
          className="text-xs font-mono text-titanium-400 hover:text-cyber-rose transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear Cart
        </button>
      </div>

      {/* Free Shipping Progress bar */}
      <div className="p-4 rounded-card glass-panel border border-white/10">
        <div className="flex items-center justify-between text-xs font-mono mb-2">
          <span className="text-titanium-200">
            {subtotal >= FREE_SHIPPING_THRESHOLD ? (
              <span className="text-cyber-emerald font-bold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> UNLOCKED: COMPLIMENTARY EXPRESS DISPATCH
              </span>
            ) : (
              <span>
                Add <strong className="text-cyber-cyan">{formatCurrency(remainingForFreeShip)}</strong> more to qualify for Free Express Shipping
              </span>
            )}
          </span>
          <span className="font-bold text-titanium-300">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 w-full rounded-pill bg-titanium-900 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
            className="h-full bg-gradient-to-r from-cyber-cyan via-cyber-blue to-cyber-emerald rounded-pill"
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
                className="glass-panel p-4 sm:p-5 rounded-card flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between border border-white/10"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-20 h-20 rounded-soft overflow-hidden bg-titanium-900 shrink-0 border border-white/10">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <span className="font-mono text-[10px] text-cyber-cyan uppercase tracking-widest font-semibold block">
                      {item.brand}
                    </span>
                    <Link
                      href={`/product/${item.sku}`}
                      className="font-semibold text-sm text-titanium-100 hover:text-cyber-cyan transition-colors block truncate"
                    >
                      {item.name}
                    </Link>
                    <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] text-titanium-400">
                      <span>SKU: {item.sku}</span>
                      {item.size && <span>• Size: {item.size}</span>}
                      {item.color && <span>• Color: {item.color}</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-6 sm:shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                  {/* Quantity Stepper */}
                  <div className="flex items-center rounded-subtle bg-titanium-900 border border-white/10">
                    <button
                      onClick={() => handleQtyChange(item.id, item.qty, -1)}
                      className="p-1.5 text-titanium-400 hover:text-white transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center font-mono text-xs font-bold text-titanium-100">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => handleQtyChange(item.id, item.qty, 1)}
                      disabled={item.qty >= item.maxInventory}
                      className="p-1.5 text-titanium-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <div className="font-mono text-base font-bold text-titanium-100">
                      {formatCurrency(item.price * item.qty)}
                    </div>
                    {item.qty > 1 && (
                      <div className="font-mono text-[10px] text-titanium-400">
                        {formatCurrency(item.price)} each
                      </div>
                    )}
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-titanium-500 hover:text-cyber-rose transition-colors p-1"
                    title="Remove item"
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
          <div className="glass-panel p-6 rounded-card space-y-6">
            <h2 className="font-mono text-sm font-bold uppercase tracking-widest text-titanium-100 border-b border-white/10 pb-3">
              ORDER SPECIFICATION
            </h2>

            {/* Promo Code Form */}
            {appliedPromo ? (
              <div className="p-3 rounded-soft bg-cyber-emerald/10 border border-cyber-emerald/30 text-xs font-mono space-y-1">
                <div className="flex items-center justify-between text-cyber-emerald font-bold">
                  <span className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" /> {appliedPromo.code}
                  </span>
                  <button
                    onClick={removePromoCode}
                    className="text-titanium-400 hover:text-cyber-rose underline text-[10px]"
                  >
                    Remove
                  </button>
                </div>
                <div className="text-[11px] text-titanium-300">
                  {appliedPromo.description}
                </div>
              </div>
            ) : (
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-titanium-400" />
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="Coupon (SUMMER15)"
                    className="w-full pl-9 pr-3 py-2 text-xs font-mono titanium-input rounded-subtle uppercase"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!promoInput.trim()}
                  className="px-3.5 py-2 rounded-subtle btn-titanium text-xs font-mono uppercase tracking-wider font-semibold disabled:opacity-40"
                >
                  Apply
                </button>
              </form>
            )}

            {/* Calculations Breakdown */}
            <div className="space-y-2.5 text-xs font-mono">
              <div className="flex justify-between text-titanium-300">
                <span>Items Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-cyber-emerald">
                  <span>Promo Discount ({appliedPromo?.code})</span>
                  <span>-{formatCurrency(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-titanium-300">
                <span>Estimated Shipping</span>
                <span>{shipping === 0 ? "FREE" : formatCurrency(shipping)}</span>
              </div>
              <div className="flex justify-between text-titanium-300">
                <span>Estimated Tax (8.25%)</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-titanium-100 pt-3 border-t border-white/10">
                <span>Grand Total</span>
                <span className="font-mono text-xl text-cyber-cyan">{formatCurrency(total)}</span>
              </div>
            </div>

            {/* Checkout Link */}
            <Link
              href="/checkout"
              className="w-full py-3.5 px-6 rounded-subtle btn-cyber-primary font-mono text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 shadow-glow"
            >
              <span>PROCEED TO CHECKOUT</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-titanium-500">
              <ShieldCheck className="w-3.5 h-3.5 text-cyber-emerald" />
              <span>END-TO-END VALIDATED STATE MACHINE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
