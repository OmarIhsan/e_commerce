"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import confetti from "canvas-confetti";
import InvoiceView from "@/components/InvoiceView";
import { CheckCircle2, Copy, Check, ArrowRight, Package, Truck, Sparkles, ShieldCheck, Cpu } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orderIdParam = searchParams.get("orderId");

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
        colors: ["#00F0FF", "#3B82F6", "#10B981"],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#00F0FF", "#6366F1", "#F59E0B"],
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
          firstName: "Alexander",
          lastName: "Kim",
          email: "alex.kim@precisionlab.io",
          address: "2040 Market Street, Suite 400",
          city: "San Francisco",
          state: "CA",
          postalCode: "94114",
          country: "United States",
          phone: "+1 (415) 890-2341",
        },
        deliveryMethod: {
          name: "Standard Carbon-Neutral",
          time: "3–5 Business Days",
          cost: 0,
        },
        paymentMethod: "Simulated Visa ending in 4242",
        subtotal: 172.0,
        discount: 25.8,
        promoCode: "SUMMER15",
        shippingFee: 0,
        tax: 12.06,
        total: 158.26,
      });
    }
  }, [orderIdParam]);

  const handleCopyOrderId = () => {
    if (!orderData) return;
    navigator.clipboard.writeText(orderData.orderId);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  if (!orderData) {
    return (
      <div className="py-24 text-center font-mono text-xs text-titanium-400">
        RETRIEVING DISPATCH CONFIRMATION...
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-4xl mx-auto">
      {/* Confirmation Hero Banner */}
      <div className="glass-panel p-8 sm:p-10 rounded-card text-center space-y-4 border border-cyber-emerald/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-60 h-60 bg-cyber-emerald/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="w-16 h-16 rounded-pill bg-cyber-emerald/10 border border-cyber-emerald/40 flex items-center justify-center mx-auto text-cyber-emerald shadow-glow-emerald">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-subtle bg-cyber-emerald/10 border border-cyber-emerald/30 text-xs font-mono text-cyber-emerald font-bold">
            <Sparkles className="w-3.5 h-3.5" /> ORDER DISPATCHED &amp; CONFIRMED
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-titanium-100">
            Thank you, {orderData.shippingAddress.firstName}!
          </h1>
          <p className="text-xs sm:text-sm text-titanium-300 max-w-md mx-auto">
            A confirmation receipt and fulfillment tracking link have been routed to{" "}
            <strong className="text-titanium-100">{orderData.shippingAddress.email}</strong>.
          </p>
        </div>

        {/* Order ID Pill */}
        <div className="pt-2 flex items-center justify-center">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-soft bg-titanium-900 border border-white/15 font-mono text-xs">
            <span className="text-titanium-400">TRACKING IDENTIFIER:</span>
            <span className="text-cyber-cyan font-bold tracking-wider text-sm">{orderData.orderId}</span>
            <button
              onClick={handleCopyOrderId}
              className="text-titanium-400 hover:text-white p-1 transition-colors"
              title="Copy Order ID"
            >
              {hasCopied ? <Check className="w-3.5 h-3.5 text-cyber-emerald" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Fulfillment Status Stepper Tracker */}
      <div className="glass-panel p-6 rounded-card border border-white/10 space-y-4">
        <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-titanium-200">
          REAL-TIME DISPATCH STATUS TIMELINE
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
          <div className="p-3 rounded-soft bg-cyber-emerald/10 border border-cyber-emerald/30 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-cyber-emerald">
              <CheckCircle2 className="w-4 h-4" /> 1. Authorized
            </div>
            <div className="text-[10px] font-mono text-titanium-400">Payment verified</div>
          </div>

          <div className="p-3 rounded-soft bg-cyber-cyan/15 border border-cyber-cyan space-y-1 shadow-glow">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-cyber-cyan">
              <Package className="w-4 h-4 animate-pulse" /> 2. Processing
            </div>
            <div className="text-[10px] font-mono text-titanium-300">Robotic bin pick</div>
          </div>

          <div className="p-3 rounded-soft bg-titanium-900/60 border border-white/5 space-y-1 opacity-60">
            <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-titanium-400">
              <Truck className="w-4 h-4" /> 3. In Transit
            </div>
            <div className="text-[10px] font-mono text-titanium-500">{orderData.deliveryMethod.name}</div>
          </div>

          <div className="p-3 rounded-soft bg-titanium-900/60 border border-white/5 space-y-1 opacity-60">
            <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-titanium-400">
              <ShieldCheck className="w-4 h-4" /> 4. Delivered
            </div>
            <div className="text-[10px] font-mono text-titanium-500">ETA {orderData.deliveryMethod.time}</div>
          </div>
        </div>
      </div>

      {/* Itemized Printable / Downloadable Invoice */}
      <InvoiceView order={orderData} />

      {/* Return to Catalog Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/10 no-print">
        <Link
          href="/"
          className="px-6 py-3 rounded-subtle btn-cyber-primary font-mono text-xs uppercase tracking-wider font-bold flex items-center gap-2 shadow-glow"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <div className="text-xs font-mono text-titanium-500">
          All test order transactions are safe and isolated.
        </div>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center font-mono text-xs text-titanium-400 flex flex-col items-center justify-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-cyber-cyan border-t-transparent animate-spin" />
          <span>INITIALIZING DISPATCH INVOICE PROTOCOL...</span>
        </div>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}
