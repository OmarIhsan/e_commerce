"use client";
import { useCart } from "@/lib/cartStore";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function MiniCart() {
  const [open, setOpen] = useState(false);
  const items = useCart(s => s.items);
  const subtotal = useCart(s => s.subtotal);
  const panelRef = useRef(null);
  const triggerRef = useRef(null);

  // Close on ESC
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Return focus to trigger when closed
  useEffect(() => {
    if (!open) {
      triggerRef.current && typeof triggerRef.current.focus === 'function' && triggerRef.current.focus();
    }
  }, [open]);

  // Basic focus trap within panel
  useEffect(() => {
    if (!open || !panelRef.current) return;
    const panel = panelRef.current;
    const focusable = panel.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    try {
      if (first && typeof first.focus === 'function') first.focus();
    } catch (err) {
      // ignore focus errors on some environments
    }

    const handler = (e) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last && typeof last.focus === 'function' && last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first && typeof first.focus === 'function' && first.focus();
        }
      }
    };
    panel.addEventListener("keydown", handler);
    return () => panel.removeEventListener("keydown", handler);
  }, [open]);

  return (
    <div>
      <button ref={triggerRef} aria-haspopup="dialog" aria-expanded={open} aria-controls="mini-cart" onClick={() => setOpen(!open)} className="relative">
        Cart
        {items.length > 0 && (
          <span className="ml-2 rounded-pill bg-danger text-paper px-2 text-xs">{items.length}</span>
        )}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40" aria-hidden onClick={() => setOpen(false)} />
          <div role="dialog" id="mini-cart" aria-label="Mini cart" className="fixed right-4 top-14 z-50 w-80 rounded-soft border border-mist bg-paper shadow" ref={panelRef}>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">Your Cart</h2>
                <button onClick={() => setOpen(false)} aria-label="Close mini cart">✕</button>
              </div>
              {items.length === 0 ? (
                <p className="text-ash text-sm">No items yet.</p>
              ) : (
                <ul className="mt-3 space-y-3">
                  {items.map(i => (
                    <li key={`${i.sku}-${i.size || 'default'}`} className="flex items-center justify-between">
                      <div>
                        <div className="text-sm">{i.name}{i.size ? ` • ${i.size}` : ''}</div>
                        <div className="text-xs text-ash">Qty {i.qty}</div>
                      </div>
                      <div className="text-sm font-medium">${(i.price * i.qty).toFixed(2)}</div>
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-ash">Subtotal</span>
                <span className="font-semibold">${subtotal().toFixed(2)}</span>
              </div>
              <div className="mt-4 flex gap-3">
                <Link href="/cart" className="rounded-subtle bg-slate text-paper px-3 py-2 text-sm">View Cart</Link>
                <Link href="/checkout" className="rounded-subtle bg-indigo text-paper px-3 py-2 text-sm">Checkout</Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
