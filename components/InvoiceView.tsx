"use client";

import React, { useRef } from "react";
import { useCurrencyStore } from "@/lib/currencyStore";
import { useEcomI18n } from "@/lib/i18n";
import { Printer, ShieldCheck, CheckCircle2, ShoppingBag } from "lucide-react";

interface InvoiceProps {
  order: {
    orderId: string;
    date: string;
    items: Array<{
      id: string;
      sku: string;
      name: string;
      brand: string;
      price: number;
      qty: number;
      size?: string;
      color?: string;
    }>;
    shippingAddress: {
      firstName: string;
      lastName: string;
      email: string;
      address: string;
      apartment?: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
      phone: string;
    };
    deliveryMethod: {
      name: string;
      time: string;
      cost: number;
    };
    paymentMethod: string;
    subtotal: number;
    discount: number;
    promoCode?: string;
    shippingFee: number;
    tax: number;
    total: number;
  };
}

export default function InvoiceView({ order }: InvoiceProps) {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const formatPrice = useCurrencyStore((s) => s.formatPrice);
  const { locale, t } = useEcomI18n();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* Action Header */}
      <div className="flex items-center justify-between no-print">
        <span className="text-xs text-slate-500 dark:text-titanium-400">
          {t.invoice.title}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-lg bg-white dark:bg-titanium-900 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer hover:border-slate-400 dark:hover:border-white/20 transition-colors shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{t.invoice.printBtn}</span>
          </button>
        </div>
      </div>

      {/* Invoice Document (Print-ready container) */}
      <div
        ref={invoiceRef}
        className="p-8 rounded-2xl bg-white dark:bg-titanium-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-titanium-100 text-xs space-y-6 shadow-xl print:bg-white print:text-black print:p-0 print:border-none"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-slate-200 dark:border-white/10 print:border-black/20 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 print:text-black font-bold text-lg">
              <ShoppingBag className="w-5 h-5" />
              <span>{t.storeName}</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-titanium-400 print:text-neutral-600">
              {t.storeSubtitle}
            </p>
          </div>

          <div className="sm:text-end space-y-1">
            <div className="font-bold text-sm text-slate-900 dark:text-white print:text-black">
              {t.invoice.orderNo}: #{order.orderId}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-titanium-400 print:text-neutral-600">
              {t.invoice.date}: {new Date(order.date).toLocaleDateString(locale === "ar" ? "ar-EG" : locale === "fr" ? "fr-FR" : "en-US", { year: "numeric", month: "short", day: "numeric" })}
            </div>
            <div className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 print:text-green-700 bg-emerald-50 dark:bg-emerald-500/10 print:bg-transparent px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-500/30 print:border-none">
              <CheckCircle2 className="w-3 h-3" />
              <span>{t.invoice.status}: {t.invoice.paid}</span>
            </div>
          </div>
        </div>

        {/* Customer & Shipping Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-b border-slate-200 dark:border-white/10 print:border-black/20 pb-6 text-[11px]">
          <div className="space-y-1">
            <div className="font-bold text-slate-900 dark:text-white print:text-black uppercase text-xs">
              {t.invoice.customer}:
            </div>
            <div className="font-semibold text-slate-900 dark:text-titanium-100 print:text-black">
              {order.shippingAddress.firstName} {order.shippingAddress.lastName}
            </div>
            <div className="text-slate-500 dark:text-titanium-400 print:text-neutral-600">
              {order.shippingAddress.address} {order.shippingAddress.apartment}
            </div>
            <div className="text-slate-500 dark:text-titanium-400 print:text-neutral-600">
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
            </div>
            <div className="text-slate-500 dark:text-titanium-400 print:text-neutral-600">
              {order.shippingAddress.country} • {order.shippingAddress.phone}
            </div>
          </div>

          <div className="space-y-1 sm:text-end">
            <div className="font-bold text-slate-900 dark:text-white print:text-black uppercase text-xs">
              {t.confirmation.deliveryMethod}:
            </div>
            <div className="text-slate-700 dark:text-titanium-300 print:text-neutral-700">
              <strong>{order.deliveryMethod.name}</strong>
            </div>
            <div className="text-slate-500 dark:text-titanium-400 print:text-neutral-600">
              {order.deliveryMethod.time}
            </div>
            <div className="text-slate-500 dark:text-titanium-400 print:text-neutral-600">
              {order.paymentMethod}
            </div>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-white/10 print:border-black/20 text-slate-500 dark:text-titanium-400 uppercase text-[10px]">
                <th className="py-2.5 text-start">{t.invoice.item}</th>
                <th className="py-2.5 text-center">{t.invoice.qty}</th>
                <th className="py-2.5 text-end">{t.invoice.price}</th>
                <th className="py-2.5 text-end">{t.invoice.total}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5 print:divide-black/10">
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td className="py-3">
                    <div className="font-semibold text-slate-900 dark:text-white print:text-black">{item.name}</div>
                    <div className="text-[10px] text-slate-500 dark:text-titanium-400 print:text-neutral-600">
                      SKU: {item.sku} {item.size && `• ${item.size}`} {item.color && `• ${item.color}`}
                    </div>
                  </td>
                  <td className="py-3 text-center text-slate-700 dark:text-titanium-200 print:text-black">{item.qty}</td>
                  <td className="py-3 text-end text-slate-700 dark:text-titanium-200 print:text-black">{formatPrice(item.price)}</td>
                  <td className="py-3 text-end font-semibold text-slate-900 dark:text-white print:text-black">
                    {formatPrice(item.price * item.qty)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Totals */}
        <div className="pt-4 border-t border-slate-200 dark:border-white/10 print:border-black/20 flex flex-col items-end space-y-1.5">
          <div className="flex justify-between w-64 text-slate-600 dark:text-titanium-300 print:text-black">
            <span>{t.invoice.subtotal}:</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>

          {order.discount > 0 && (
            <div className="flex justify-between w-64 text-emerald-600 dark:text-emerald-400 print:text-green-700">
              <span>{t.invoice.discount} ({order.promoCode}):</span>
              <span>-{formatPrice(order.discount)}</span>
            </div>
          )}

          <div className="flex justify-between w-64 text-slate-600 dark:text-titanium-300 print:text-black">
            <span>{t.invoice.shipping}:</span>
            <span>{order.shippingFee === 0 ? t.cart.free : formatPrice(order.shippingFee)}</span>
          </div>

          <div className="flex justify-between w-64 text-slate-600 dark:text-titanium-300 print:text-black">
            <span>Tax (Estimated):</span>
            <span>{formatPrice(order.tax)}</span>
          </div>

          <div className="flex justify-between w-64 text-base font-bold text-slate-900 dark:text-white print:text-black pt-2 border-t border-slate-200 dark:border-white/10 print:border-black/20">
            <span>{t.invoice.finalTotal}:</span>
            <span className="text-blue-600 dark:text-blue-400 print:text-black">{formatPrice(order.total)}</span>
          </div>
        </div>

        {/* Security watermark footer */}
        <div className="pt-6 border-t border-slate-200 dark:border-white/10 print:border-black/20 text-center text-[10px] text-slate-400 dark:text-titanium-500 print:text-neutral-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 print:text-black" />
          <span>{t.footer.guaranteeText}</span>
        </div>
      </div>
    </div>
  );
}
