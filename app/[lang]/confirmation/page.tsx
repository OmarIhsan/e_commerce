"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import confetti from "canvas-confetti";
import InvoiceView from "@/components/InvoiceView";
import { CheckCircle2, Copy, Check, ArrowRight, ArrowLeft, Package, Truck, Sparkles, ShieldCheck } from "lucide-react";
import { useCurrencyStore } from "@/lib/currencyStore";
import { useEcomI18n } from "@/lib/i18n";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orderIdParam = searchParams.get("orderId");
  const { locale, dir, t } = useEcomI18n();
  const isRtl = dir === "rtl";
  const formatPrice = useCurrencyStore((s) => s.formatPrice);

  const [orderData, setOrderData] = useState<any>(null);
  const [hasCopied, setHasCopied] = useState(false);

  useEffect(() => {
    // Trigger celebratory confetti cannon
    const duration = 2.5 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#3B82F6", "#6366F1", "#10B981"],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#3B82F6", "#6366F1", "#F59E0B"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();

    // Retrieve order data from sessionStorage
    const currentId = orderIdParam || (typeof window !== "undefined" ? sessionStorage.getItem("latest_order_id") : null) || "ORD-7X9Q-2K41";
    let stored = null;
    try {
      const raw = sessionStorage.getItem(`order_${currentId}`);
      if (raw) stored = JSON.parse(raw);
    } catch (e) {}

    if (stored) {
      setOrderData(stored);
    } else {
      // Fallback sample mock order
      setOrderData({
        orderId: currentId,
        date: new Date().toISOString(),
        items: [
          {
            id: "W-TEE-ESSNT-001-M-Onyx Black",
            sku: "W-TEE-ESSNT-001",
            name: "AeroForm Heavyweight Tee",
            brand: "TITAN STUDIO",
            price: 34.0,
            qty: 1,
            size: "M",
            color: "Onyx Black",
          },
          {
            id: "M-CHN-CHRO-013-L-Titanium Dark",
            sku: "M-CHN-CHRO-013",
            name: "Tactical Chore Overshirt",
            brand: "KINETIC LAB",
            price: 138.0,
            qty: 1,
            size: "L",
            color: "Titanium Dark",
          },
        ],
        shippingAddress: {
          firstName: "Alex",
          lastName: "Morgan",
          email: "customer@example.com",
          address: "123 Main Street",
          city: "Paris",
          state: "Île-de-France",
          postalCode: "75001",
          country: "France",
          phone: "+33 6 12 34 56 78",
        },
        deliveryMethod: {
          name: t.checkout.standard,
          time: t.checkout.standardTime,
          cost: 0,
        },
        paymentMethod: "Credit Card (•••• 4242)",
        subtotal: 172.0,
        discount: 25.8,
        promoCode: "SUMMER15",
        shippingFee: 0,
        tax: 12.06,
        total: 158.26,
      });
    }
  }, [orderIdParam, t]);

  const handleCopyOrderId = () => {
    if (!orderData) return;
    navigator.clipboard.writeText(orderData.orderId);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  if (!orderData) {
    return (
      <div className="py-24 text-center text-xs text-titanium-400">
        Loading...
      </div>
    );
  }

  const ShopArrow = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Banner */}
      <div className="p-8 sm:p-10 rounded-2xl bg-titanium-900 border border-white/10 text-center space-y-4 shadow-xl">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
            {t.confirmation.title}
          </h1>
          <p className="text-xs sm:text-sm text-titanium-300 max-w-lg mx-auto leading-relaxed">
            {t.confirmation.subtitle}
          </p>
        </div>

        {/* Order ID Pill */}
        <div className="pt-2 flex items-center justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-titanium-950 border border-white/10 text-xs">
            <span className="text-titanium-400">{t.confirmation.orderId}:</span>
            <strong className="text-blue-400 font-bold tracking-wider">{orderData.orderId}</strong>
            <button
              onClick={handleCopyOrderId}
              className="p-1 text-titanium-400 hover:text-white transition-colors"
              title={hasCopied ? t.confirmation.copied : t.confirmation.copy}
            >
              {hasCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs">
          <Link
            href={`/${locale}`}
            className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center gap-2 shadow-sm transition-colors"
          >
            <span>{t.confirmation.continueShopping}</span>
            <ShopArrow className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Summary Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-titanium-900 border border-white/10 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-white">
            <Package className="w-4 h-4 text-blue-400" />
            <span>{t.confirmation.itemsOrdered}</span>
          </div>
          <div className="text-xs text-titanium-300 space-y-1">
            {orderData.items.map((i: any) => (
              <div key={i.id} className="flex justify-between">
                <span className="truncate max-w-[160px]">{i.name}</span>
                <span className="text-titanium-400">x{i.qty}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 rounded-xl bg-titanium-900 border border-white/10 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-white">
            <Truck className="w-4 h-4 text-emerald-400" />
            <span>{t.confirmation.shippingAddress}</span>
          </div>
          <div className="text-xs text-titanium-300 leading-relaxed">
            <p className="font-semibold text-white">
              {orderData.shippingAddress.firstName} {orderData.shippingAddress.lastName}
            </p>
            <p>{orderData.shippingAddress.address}</p>
            <p>
              {orderData.shippingAddress.city}, {orderData.shippingAddress.postalCode}
            </p>
            <p>{orderData.shippingAddress.country}</p>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-titanium-900 border border-white/10 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-white">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>{t.confirmation.paymentMethod}</span>
          </div>
          <div className="text-xs text-titanium-300 leading-relaxed space-y-1">
            <p className="font-semibold text-white">{orderData.paymentMethod}</p>
            <p className="text-emerald-400 font-semibold">{t.invoice.paid}</p>
            <div className="pt-2 flex justify-between border-t border-white/5 font-bold text-white">
              <span>{t.cart.total}:</span>
              <span className="text-blue-400">{formatPrice(orderData.total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Printable Invoice Component */}
      <InvoiceView order={orderData} />
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center text-xs text-titanium-400">
          Loading confirmation...
        </div>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}
