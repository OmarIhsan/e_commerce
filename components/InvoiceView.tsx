"use client";

import React, { useRef } from "react";
import { formatCurrency } from "@/lib/utils";
import { Printer, Download, QrCode, ShieldCheck, CheckCircle2, Zap } from "lucide-react";

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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* Action Header */}
      <div className="flex items-center justify-between no-print">
        <span className="text-xs font-mono text-titanium-400">
          OFFICIAL DISPATCH INVOICE (VAT ITEMIZED)
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-subtle btn-titanium font-mono text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" /> Print / Save as PDF
          </button>
        </div>
      </div>

      {/* Invoice Document (Print-ready container) */}
      <div
        ref={invoiceRef}
        className="p-8 rounded-card bg-titanium-900 border border-white/10 text-titanium-100 font-mono text-xs space-y-6 shadow-2xl print:bg-white print:text-black print:p-0 print:border-none"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-white/10 print:border-black/20 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-cyber-cyan print:text-black font-black text-lg tracking-widest uppercase">
              <Zap className="w-5 h-5" />
              <span>TITAN.LAB PRECISION COMMERCE</span>
            </div>
            <p className="text-[11px] text-titanium-400 print:text-neutral-600">
              Tax ID: US-VAT-9402198 • Global Fulfillment Hub 01
            </p>
            <p className="text-[11px] text-titanium-400 print:text-neutral-600">
              2040 Market Street, San Francisco, CA 94114, USA
            </p>
          </div>

          <div className="sm:text-right space-y-1">
            <div className="font-bold text-sm text-titanium-100 print:text-black">
              INVOICE: #{order.orderId}
            </div>
            <div className="text-[11px] text-titanium-400 print:text-neutral-600">
              DATE: {new Date(order.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
            </div>
            <div className="inline-flex items-center gap-1 text-[10px] font-bold text-cyber-emerald print:text-green-700 bg-cyber-emerald/10 print:bg-transparent px-2 py-0.5 rounded border border-cyber-emerald/30 print:border-none">
              <CheckCircle2 className="w-3 h-3" /> PAYMENT STATUS: SETTLED (SIMULATED)
            </div>
          </div>
        </div>

        {/* Customer & Shipping Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-b border-white/10 print:border-black/20 pb-6 text-[11px]">
          <div className="space-y-1">
            <div className="font-bold text-titanium-200 print:text-black uppercase text-xs">
              BILLED &amp; SHIPPED TO:
            </div>
            <div className="font-bold text-titanium-100 print:text-black">
              {order.shippingAddress.firstName} {order.shippingAddress.lastName}
            </div>
            <div className="text-titanium-400 print:text-neutral-600">
              {order.shippingAddress.address} {order.shippingAddress.apartment}
            </div>
            <div className="text-titanium-400 print:text-neutral-600">
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
            </div>
            <div className="text-titanium-400 print:text-neutral-600">
              {order.shippingAddress.country} • {order.shippingAddress.phone}
            </div>
          </div>

          <div className="space-y-1 sm:text-right">
            <div className="font-bold text-titanium-200 print:text-black uppercase text-xs">
              DISPATCH TELEMETRY:
            </div>
            <div className="text-titanium-300 print:text-neutral-700">
              Carrier Tier: <strong>{order.deliveryMethod.name}</strong>
            </div>
            <div className="text-titanium-400 print:text-neutral-600">
              ETA Window: {order.deliveryMethod.time}
            </div>
            <div className="text-titanium-400 print:text-neutral-600">
              Payment Gateway: {order.paymentMethod}
            </div>
          </div>
        </div>

        {/* Itemized Line Items Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 print:border-black/20 text-titanium-400 print:text-neutral-600 text-[10px] uppercase">
                <th className="py-2">Item / SKU</th>
                <th className="py-2">Specifications</th>
                <th className="py-2 text-center">Qty</th>
                <th className="py-2 text-right">Unit Price</th>
                <th className="py-2 text-right">Line Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 print:divide-neutral-200">
              {order.items.map((item) => (
                <tr key={item.id} className="text-titanium-200 print:text-black">
                  <td className="py-3">
                    <div className="font-semibold text-titanium-100 print:text-black">{item.name}</div>
                    <div className="text-[10px] text-titanium-500 font-mono">{item.sku} • {item.brand}</div>
                  </td>
                  <td className="py-3 text-[11px] text-titanium-400 print:text-neutral-600">
                    {item.size ? `Size: ${item.size} ` : ""}
                    {item.color ? `• Color: ${item.color}` : ""}
                    {!item.size && !item.color ? "Standard Configuration" : ""}
                  </td>
                  <td className="py-3 text-center font-bold">{item.qty}</td>
                  <td className="py-3 text-right">{formatCurrency(item.price)}</td>
                  <td className="py-3 text-right font-bold text-titanium-100 print:text-black">
                    {formatCurrency(item.price * item.qty)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals & VAT Breakdown */}
        <div className="border-t border-white/10 print:border-black/20 pt-4 flex flex-col sm:flex-row justify-between items-start gap-6">
          {/* QR Code & Verification Stamp */}
          <div className="flex items-center gap-4 p-3 rounded-soft bg-white/[0.02] print:bg-transparent border border-white/5 print:border-black/10">
            {/* SVG QR Code Simulation */}
            <div className="w-16 h-16 bg-white p-1 rounded flex items-center justify-center shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <rect width="100" height="100" fill="white" />
                <rect x="10" y="10" width="25" height="25" fill="black" />
                <rect x="15" y="15" width="15" height="15" fill="white" />
                <rect x="18" y="18" width="9" height="9" fill="black" />
                <rect x="65" y="10" width="25" height="25" fill="black" />
                <rect x="70" y="15" width="15" height="15" fill="white" />
                <rect x="73" y="18" width="9" height="9" fill="black" />
                <rect x="10" y="65" width="25" height="25" fill="black" />
                <rect x="15" y="70" width="15" height="15" fill="white" />
                <rect x="18" y="73" width="9" height="9" fill="black" />
                <circle cx="50" cy="50" r="10" fill="black" />
                <rect x="42" y="15" width="8" height="8" fill="black" />
                <rect x="55" y="72" width="12" height="8" fill="black" />
                <rect x="75" y="55" width="15" height="10" fill="black" />
              </svg>
            </div>
            <div className="space-y-0.5 text-[10px]">
              <div className="font-bold text-titanium-200 print:text-black">
                CRYPTOGRAPHIC ORDER SEAL
              </div>
              <div className="text-titanium-500 print:text-neutral-500 truncate max-w-[180px]">
                SHA-256: 7f8a9e21b...80c21
              </div>
              <div className="text-cyber-emerald print:text-green-700 font-semibold">
                SCAN TO VERIFY INTEGRITY
              </div>
            </div>
          </div>

          {/* Numerical Totals */}
          <div className="w-full sm:w-64 space-y-1.5 text-right text-xs">
            <div className="flex justify-between text-titanium-400 print:text-neutral-600">
              <span>Subtotal:</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-cyber-emerald print:text-green-700">
                <span>Discount ({order.promoCode}):</span>
                <span>-{formatCurrency(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-titanium-400 print:text-neutral-600">
              <span>Shipping Fee:</span>
              <span>{order.shippingFee === 0 ? "FREE" : formatCurrency(order.shippingFee)}</span>
            </div>
            <div className="flex justify-between text-titanium-400 print:text-neutral-600">
              <span>Itemized VAT (8.25%):</span>
              <span>{formatCurrency(order.tax)}</span>
            </div>
            <div className="flex justify-between font-bold text-sm text-titanium-100 print:text-black pt-2 border-t border-white/10 print:border-black/20">
              <span>Total Paid:</span>
              <span className="text-cyber-cyan print:text-black text-base">{formatCurrency(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-[10px] text-titanium-500 print:text-neutral-500 border-t border-white/5 print:border-neutral-200 pt-4 text-center">
          Thank you for choosing TITAN.LAB. For returns or support inquiries, quote Order ID #{order.orderId}.
        </div>
      </div>
    </div>
  );
}
