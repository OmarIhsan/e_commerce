"use client";

import { useCartStore } from "@/lib/cartStore";
import { formatCurrency, FREE_SHIPPING_THRESHOLD } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { X, Trash2, Plus, Minus, ArrowRight, Tag, ShieldCheck, Sparkles, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/components/ToastProvider";

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

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeDrawer}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            {/* Drawer panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-screen max-w-md bg-titanium-950/95 border-l border-white/10 text-titanium-100 flex flex-col shadow-2xl backdrop-blur-2xl"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
                <div className="flex items-center gap-2.5">
                  <ShoppingBag className="w-5 h-5 text-cyber-cyan" />
                  <h2 className="font-mono text-sm font-bold uppercase tracking-widest text-titanium-100">
                    DISPATCH CART ({items.reduce((s, i) => s + i.qty, 0)})
                  </h2>
                </div>
                <button
                  onClick={closeDrawer}
                  className="p-1.5 rounded-subtle text-titanium-400 hover:text-white hover:bg-white/5 transition-colors"
                  aria-label="Close cart"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Free Shipping Progress Meter */}
              <div className="px-6 py-3.5 bg-titanium-900/60 border-b border-white/5">
                <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                  <span className="text-titanium-300">
                    {subtotal >= FREE_SHIPPING_THRESHOLD ? (
                      <span className="text-cyber-emerald font-semibold flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" /> FREE EXPRESS SHIPPING UNLOCKED
                      </span>
                    ) : (
                      <span>
                        Add <strong className="text-cyber-cyan">{formatCurrency(remainingForFreeShip)}</strong> for Free Express Shipping
                      </span>
                    )}
                  </span>
                  <span className="text-titanium-400 font-medium">{Math.round(progress)}%</span>
                </div>
                <div className="h-1.5 w-full rounded-pill bg-titanium-800 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-emerald rounded-pill"
                  />
                </div>
              </div>

              {/* Item List */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12">
                    <div className="w-16 h-16 rounded-pill bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-titanium-500">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                    <h3 className="font-mono text-sm font-semibold uppercase tracking-wider text-titanium-200">
                      CART IS CURRENTLY EMPTY
                    </h3>
                    <p className="text-xs text-titanium-400 mt-1 max-w-xs">
                      Explore our high-precision catalog and add items with sub-second optimistic updates.
                    </p>
                    <button
                      onClick={closeDrawer}
                      className="mt-6 px-4 py-2 rounded-subtle btn-titanium text-xs font-mono uppercase tracking-wider"
                    >
                      Browse Catalog
                    </button>
                  </div>
                ) : (
                  items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="flex gap-4 p-3.5 rounded-soft bg-titanium-900/50 border border-white/5 relative group hover:border-white/15 transition-all"
                    >
                      <div className="w-18 h-20 w-20 rounded-subtle overflow-hidden bg-titanium-850 shrink-0 border border-white/10">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-mono text-[10px] text-titanium-400 uppercase tracking-widest">
                              {item.brand}
                            </span>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-titanium-500 hover:text-cyber-rose transition-colors p-0.5"
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <Link
                            href={`/product/${item.sku}`}
                            onClick={closeDrawer}
                            className="font-medium text-xs text-titanium-100 hover:text-cyber-cyan transition-colors truncate block"
                          >
                            {item.name}
                          </Link>
                          {(item.size || item.color) && (
                            <div className="flex items-center gap-1.5 mt-1 font-mono text-[10px] text-titanium-400">
                              {item.size && (
                                <span className="bg-white/5 px-1.5 py-0.5 rounded border border-white/5">
                                  {item.size}
                                </span>
                              )}
                              {item.color && (
                                <span className="bg-white/5 px-1.5 py-0.5 rounded border border-white/5">
                                  {item.color}
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          {/* Stepper with stock guard */}
                          <div className="flex items-center rounded-subtle bg-titanium-800/80 border border-white/10">
                            <button
                              onClick={() => handleUpdateQty(item.id, item.qty, -1)}
                              className="p-1 hover:text-white text-titanium-400 transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-7 text-center font-mono text-xs font-semibold">
                              {item.qty}
                            </span>
                            <button
                              onClick={() => handleUpdateQty(item.id, item.qty, 1)}
                              disabled={item.qty >= item.maxInventory}
                              className="p-1 hover:text-white text-titanium-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="text-right">
                            <span className="font-mono text-xs font-bold text-titanium-100">
                              {formatCurrency(item.price * item.qty)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Footer Calculations & Checkout */}
              {items.length > 0 && (
                <div className="p-6 border-t border-white/10 bg-titanium-900/70 space-y-4">
                  {/* Promo input */}
                  {appliedPromo ? (
                    <div className="flex items-center justify-between p-2.5 rounded-subtle bg-cyber-emerald/10 border border-cyber-emerald/30 text-xs font-mono">
                      <div className="flex items-center gap-2 text-cyber-emerald">
                        <Tag className="w-3.5 h-3.5" />
                        <span>PROMO APPLIED: <strong>{appliedPromo.code}</strong> ({appliedPromo.description})</span>
                      </div>
                      <button
                        onClick={removePromoCode}
                        className="text-titanium-400 hover:text-cyber-rose transition-colors text-[10px] underline"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyPromo} className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-titanium-500" />
                        <input
                          type="text"
                          value={promoInput}
                          onChange={(e) => setPromoInput(e.target.value)}
                          placeholder="Promo code (e.g. SUMMER15)"
                          className="w-full pl-9 pr-3 py-2 text-xs font-mono titanium-input rounded-subtle uppercase"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isApplyingPromo || !promoInput.trim()}
                        className="px-3 py-2 rounded-subtle btn-titanium text-xs font-mono uppercase tracking-wider font-semibold disabled:opacity-40"
                      >
                        Apply
                      </button>
                    </form>
                  )}

                  {/* Pricing Breakdown */}
                  <div className="space-y-1.5 text-xs font-mono">
                    <div className="flex justify-between text-titanium-300">
                      <span>Subtotal</span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-cyber-emerald">
                        <span>Promo Discount</span>
                        <span>-{formatCurrency(discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-titanium-300">
                      <span>Shipping</span>
                      <span>{shipping === 0 ? "FREE" : formatCurrency(shipping)}</span>
                    </div>
                    <div className="flex justify-between text-titanium-300">
                      <span>Estimated Tax (8.25%)</span>
                      <span>{formatCurrency(total - (subtotal - discount + shipping))}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-titanium-100 pt-2 border-t border-white/10">
                      <span>Total Amount</span>
                      <span className="text-cyber-cyan font-mono text-base">{formatCurrency(total)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <Link
                      href="/cart"
                      onClick={closeDrawer}
                      className="flex items-center justify-center py-2.5 rounded-subtle btn-titanium font-mono text-xs uppercase tracking-wider font-semibold"
                    >
                      View Cart
                    </Link>
                    <Link
                      href="/checkout"
                      onClick={closeDrawer}
                      className="flex items-center justify-center gap-1.5 py-2.5 rounded-subtle btn-cyber-primary font-mono text-xs uppercase tracking-wider font-bold shadow-glow"
                    >
                      Checkout <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono text-titanium-500 pt-1">
                    <ShieldCheck className="w-3 h-3 text-cyber-emerald" />
                    <span>256-BIT ENCRYPTED SIMULATION DISPATCH</span>
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
