"use client";
import { useCart } from "@/lib/cartStore";

export default function CartPage() {
  const items = useCart(state => state.items);
  const remove = useCart(state => state.remove);
  const subtotal = useCart(state => state.subtotal);

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold">Cart</h1>
      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul className="space-y-4">
            {items.map(i => (
              <li key={`${i.sku}-${i.size || 'default'}`} className="flex items-center justify-between border border-mist rounded-subtle p-4">
                <div>
                  <div className="font-medium">{i.name}{i.size ? ` • ${i.size}` : ''}</div>
                  <div className="text-sm text-ash">Qty {i.qty}</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="font-semibold">${(i.price * i.qty).toFixed(2)}</div>
                  <button className="text-danger" onClick={() => remove(i.sku, i.size)}>Remove</button>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-end gap-6">
            <div className="text-xl font-semibold">Subtotal: ${subtotal().toFixed(2)}</div>
            <a href="/checkout" className="rounded-subtle bg-indigo text-paper px-4 py-2">Checkout</a>
          </div>
        </>
      )}
    </section>
  );
}
