"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/cartStore";
import { formatCurrency, generateOrderId, FREE_SHIPPING_THRESHOLD } from "@/lib/utils";
import { useToast } from "@/components/ToastProvider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  ShieldCheck, 
  CreditCard, 
  Truck, 
  User, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Lock, 
  Sparkles, 
  CheckCircle2, 
  Zap,
  ShoppingBag,
  Info
} from "lucide-react";
import Link from "next/link";

// 1. Shipping Schema
const shippingSchema = z.object({
  email: z.string().email("Valid work or personal email required"),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  address: z.string().min(5, "Street address required"),
  apartment: z.string().optional(),
  city: z.string().min(2, "City required"),
  state: z.string().min(2, "State / Region required"),
  postalCode: z.string().min(3, "Valid ZIP / Postal code required"),
  country: z.string().min(2, "Country required"),
  phone: z.string().min(7, "Valid phone number required"),
});

type ShippingFormData = z.infer<typeof shippingSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const { success, error } = useToast();

  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const appliedPromo = useCartStore((s) => s.appliedPromo);
  const getSubtotal = useCartStore((s) => s.getSubtotal);
  const getDiscountAmount = useCartStore((s) => s.getDiscountAmount);
  const hasHydrated = useCartStore((s) => s.hasHydrated);

  const [mounted, setMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Delivery method selection
  const [selectedDelivery, setSelectedDelivery] = useState<"economy" | "standard" | "express">("standard");

  // Payment mock state
  const [cardNumber, setCardNumber] = useState("4242 •••• •••• 4242");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvc, setCardCvc] = useState("739");
  const [cardName, setCardName] = useState("ALEXANDER KIM");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => setMounted(true), []);

  const subtotal = getSubtotal();
  const discount = getDiscountAmount();

  // Delivery costs
  const deliveryOptions = {
    economy: {
      id: "economy",
      name: "Economy Ground",
      time: "5–8 Business Days",
      cost: subtotal >= FREE_SHIPPING_THRESHOLD || appliedPromo?.discountType === "freeship" ? 0 : 4.0,
    },
    standard: {
      id: "standard",
      name: "Standard Carbon-Neutral",
      time: "3–5 Business Days",
      cost: subtotal >= FREE_SHIPPING_THRESHOLD || appliedPromo?.discountType === "freeship" ? 0 : 6.0,
    },
    express: {
      id: "express",
      name: "Express Next-Flight Priority",
      time: "1–2 Business Days",
      cost: 18.0,
    },
  };

  const selectedShippingFee = deliveryOptions[selectedDelivery].cost;
  const taxable = Math.max(0, subtotal - discount + selectedShippingFee);
  const tax = taxable * 0.0825;
  const grandTotal = Math.max(0, subtotal - discount + selectedShippingFee + tax);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
    mode: "onChange",
    defaultValues: {
      email: "alex.kim@precisionlab.io",
      firstName: "Alex",
      lastName: "Kim",
      address: "2040 Market Street, Suite 400",
      city: "San Francisco",
      state: "CA",
      postalCode: "94114",
      country: "United States",
      phone: "+1 (415) 890-2341",
    },
  });

  const shippingFormValues = watch();

  const handleShippingSubmit = (data: ShippingFormData) => {
    setCurrentStep(2);
  };

  const handleApplePaySimulate = () => {
    handleProcessOrder("Apple Pay Simulation");
  };

  const handleProcessOrder = (paymentMethodName: string = "Simulated Visa •••• 4242") => {
    setIsProcessing(true);

    const orderId = generateOrderId();
    const orderRecord = {
      orderId,
      date: new Date().toISOString(),
      items,
      shippingAddress: shippingFormValues,
      deliveryMethod: deliveryOptions[selectedDelivery],
      paymentMethod: paymentMethodName,
      subtotal,
      discount,
      promoCode: appliedPromo?.code,
      shippingFee: selectedShippingFee,
      tax,
      total: grandTotal,
    };

    // Save order simulation into sessionStorage
    try {
      sessionStorage.setItem(`order_${orderId}`, JSON.stringify(orderRecord));
      sessionStorage.setItem("latest_order_id", orderId);
    } catch (e) {
      console.warn("Storage error", e);
    }

    setTimeout(() => {
      clearCart();
      success(`Order ${orderId} confirmed and dispatched!`);
      router.push(`/confirmation?orderId=${orderId}`);
    }, 1200);
  };

  if (!mounted || !hasHydrated) {
    return (
      <div className="py-24 text-center font-mono text-xs text-titanium-400">
        INITIALIZING SECURE CHECKOUT PROTOCOL...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="glass-panel p-12 rounded-card text-center max-w-lg mx-auto space-y-6 my-8">
        <div className="w-16 h-16 rounded-pill bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-titanium-400">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-bold font-mono text-titanium-100 uppercase">
          NO ITEMS IN CHECKOUT QUEUE
        </h1>
        <p className="text-xs text-titanium-400">
          Your cart is currently empty. Please add products from the catalog to initiate checkout.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-subtle btn-cyber-primary font-mono text-xs uppercase tracking-wider font-bold"
        >
          Return to Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Checkout Progress Stepper Bar */}
      <div className="glass-panel p-4 rounded-card border border-white/10">
        <div className="grid grid-cols-3 gap-2">
          {/* Step 1 */}
          <button
            onClick={() => setCurrentStep(1)}
            className={`flex items-center justify-center gap-2 p-2.5 rounded-subtle font-mono text-xs transition-all ${
              currentStep === 1
                ? "bg-cyber-cyan/15 border border-cyber-cyan text-cyber-cyan font-bold shadow-glow"
                : currentStep > 1
                ? "bg-white/5 text-cyber-emerald border border-cyber-emerald/30 font-semibold"
                : "text-titanium-500"
            }`}
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-pill bg-white/10 text-[10px]">
              {currentStep > 1 ? <Check className="w-3 h-3" /> : "1"}
            </span>
            <span className="hidden sm:inline">1. SHIPPING &amp; CONTACT</span>
          </button>

          {/* Step 2 */}
          <button
            onClick={() => {
              if (isValid) setCurrentStep(2);
            }}
            disabled={!isValid}
            className={`flex items-center justify-center gap-2 p-2.5 rounded-subtle font-mono text-xs transition-all ${
              currentStep === 2
                ? "bg-cyber-cyan/15 border border-cyber-cyan text-cyber-cyan font-bold shadow-glow"
                : currentStep > 2
                ? "bg-white/5 text-cyber-emerald border border-cyber-emerald/30 font-semibold"
                : "text-titanium-500 opacity-60"
            }`}
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-pill bg-white/10 text-[10px]">
              {currentStep > 2 ? <Check className="w-3 h-3" /> : "2"}
            </span>
            <span className="hidden sm:inline">2. DELIVERY TIER</span>
          </button>

          {/* Step 3 */}
          <button
            onClick={() => {
              if (isValid) setCurrentStep(3);
            }}
            disabled={!isValid}
            className={`flex items-center justify-center gap-2 p-2.5 rounded-subtle font-mono text-xs transition-all ${
              currentStep === 3
                ? "bg-cyber-cyan/15 border border-cyber-cyan text-cyber-cyan font-bold shadow-glow"
                : "text-titanium-500 opacity-60"
            }`}
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-pill bg-white/10 text-[10px]">
              3
            </span>
            <span className="hidden sm:inline">3. SIMULATED PAYMENT</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Multi-Step Interactive Form */}
        <div className="lg:col-span-7 space-y-6">
          {/* STEP 1: Shipping & Contact Form */}
          {currentStep === 1 && (
            <div className="glass-panel p-6 sm:p-8 rounded-card space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <User className="w-5 h-5 text-cyber-cyan" />
                  <h2 className="font-mono text-sm font-bold uppercase tracking-widest text-titanium-100">
                    STEP 1: SHIPPING &amp; CONTACT SPECIFICATION
                  </h2>
                </div>
                <span className="text-[11px] font-mono text-cyber-emerald">Zod Real-Time Validated</span>
              </div>

              <form onSubmit={handleSubmit(handleShippingSubmit)} className="space-y-4">
                {/* Email */}
                <div className="space-y-1">
                  <label className="text-xs font-mono text-titanium-300 uppercase tracking-wider block">
                    Contact Email Address *
                  </label>
                  <input
                    type="email"
                    {...register("email")}
                    className="w-full px-3.5 py-2.5 rounded-subtle titanium-input text-xs font-mono"
                    placeholder="name@example.com"
                  />
                  {errors.email && (
                    <p className="text-[11px] font-mono text-cyber-rose">{errors.email.message}</p>
                  )}
                </div>

                {/* Name Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-titanium-300 uppercase tracking-wider block">
                      First Name *
                    </label>
                    <input
                      type="text"
                      {...register("firstName")}
                      className="w-full px-3.5 py-2.5 rounded-subtle titanium-input text-xs font-mono"
                    />
                    {errors.firstName && (
                      <p className="text-[11px] font-mono text-cyber-rose">{errors.firstName.message}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-titanium-300 uppercase tracking-wider block">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      {...register("lastName")}
                      className="w-full px-3.5 py-2.5 rounded-subtle titanium-input text-xs font-mono"
                    />
                    {errors.lastName && (
                      <p className="text-[11px] font-mono text-cyber-rose">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-1">
                  <label className="text-xs font-mono text-titanium-300 uppercase tracking-wider block">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    {...register("address")}
                    className="w-full px-3.5 py-2.5 rounded-subtle titanium-input text-xs font-mono"
                    placeholder="e.g. 2040 Market St"
                  />
                  {errors.address && (
                    <p className="text-[11px] font-mono text-cyber-rose">{errors.address.message}</p>
                  )}
                </div>

                {/* Apartment / Suite */}
                <div className="space-y-1">
                  <label className="text-xs font-mono text-titanium-300 uppercase tracking-wider block">
                    Apt, Suite, Unit (Optional)
                  </label>
                  <input
                    type="text"
                    {...register("apartment")}
                    className="w-full px-3.5 py-2.5 rounded-subtle titanium-input text-xs font-mono"
                    placeholder="Suite 400"
                  />
                </div>

                {/* City, State, Postal Code */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-titanium-300 uppercase tracking-wider block">
                      City *
                    </label>
                    <input
                      type="text"
                      {...register("city")}
                      className="w-full px-3.5 py-2.5 rounded-subtle titanium-input text-xs font-mono"
                    />
                    {errors.city && (
                      <p className="text-[11px] font-mono text-cyber-rose">{errors.city.message}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-titanium-300 uppercase tracking-wider block">
                      State / Region *
                    </label>
                    <input
                      type="text"
                      {...register("state")}
                      className="w-full px-3.5 py-2.5 rounded-subtle titanium-input text-xs font-mono"
                    />
                    {errors.state && (
                      <p className="text-[11px] font-mono text-cyber-rose">{errors.state.message}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-titanium-300 uppercase tracking-wider block">
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      {...register("postalCode")}
                      className="w-full px-3.5 py-2.5 rounded-subtle titanium-input text-xs font-mono"
                    />
                    {errors.postalCode && (
                      <p className="text-[11px] font-mono text-cyber-rose">{errors.postalCode.message}</p>
                    )}
                  </div>
                </div>

                {/* Phone Number */}
                <div className="space-y-1">
                  <label className="text-xs font-mono text-titanium-300 uppercase tracking-wider block">
                    Contact Phone Number *
                  </label>
                  <input
                    type="tel"
                    {...register("phone")}
                    className="w-full px-3.5 py-2.5 rounded-subtle titanium-input text-xs font-mono"
                  />
                  {errors.phone && (
                    <p className="text-[11px] font-mono text-cyber-rose">{errors.phone.message}</p>
                  )}
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-subtle btn-cyber-primary font-mono text-xs uppercase tracking-wider font-bold flex items-center gap-2 shadow-glow"
                  >
                    Continue to Delivery <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 2: Delivery Method Selection */}
          {currentStep === 2 && (
            <div className="glass-panel p-6 sm:p-8 rounded-card space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <Truck className="w-5 h-5 text-cyber-cyan" />
                  <h2 className="font-mono text-sm font-bold uppercase tracking-widest text-titanium-100">
                    STEP 2: DISPATCH SPEED &amp; CARRIER TIER
                  </h2>
                </div>
                <button
                  onClick={() => setCurrentStep(1)}
                  className="text-xs font-mono text-cyber-cyan hover:underline flex items-center gap-1"
                >
                  <ArrowLeft className="w-3 h-3" /> Edit Address
                </button>
              </div>

              <div className="space-y-3">
                {Object.values(deliveryOptions).map((opt) => {
                  const isSelected = selectedDelivery === opt.id;
                  return (
                    <label
                      key={opt.id}
                      onClick={() => setSelectedDelivery(opt.id as any)}
                      className={`flex items-center justify-between p-4 rounded-soft border cursor-pointer transition-all ${
                        isSelected
                          ? "bg-cyber-cyan/10 border-cyber-cyan shadow-glow"
                          : "bg-titanium-900/60 border-white/10 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected
                              ? "border-cyber-cyan bg-cyber-cyan"
                              : "border-white/30"
                          }`}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-titanium-950" />}
                        </div>
                        <div>
                          <div className="font-mono text-xs font-bold text-titanium-100">
                            {opt.name}
                          </div>
                          <div className="text-[11px] font-mono text-titanium-400">
                            Estimated Delivery: {opt.time}
                          </div>
                        </div>
                      </div>
                      <div className="font-mono text-xs font-bold text-titanium-100">
                        {opt.cost === 0 ? (
                          <span className="text-cyber-emerald">FREE</span>
                        ) : (
                          formatCurrency(opt.cost)
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2.5 rounded-subtle btn-titanium font-mono text-xs uppercase tracking-wider flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-6 py-3 rounded-subtle btn-cyber-primary font-mono text-xs uppercase tracking-wider font-bold flex items-center gap-2 shadow-glow"
                >
                  Continue to Payment <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Simulated Payment Gateway */}
          {currentStep === 3 && (
            <div className="glass-panel p-6 sm:p-8 rounded-card space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <CreditCard className="w-5 h-5 text-cyber-cyan" />
                  <h2 className="font-mono text-sm font-bold uppercase tracking-widest text-titanium-100">
                    STEP 3: SIMULATED SECURE PAYMENT GATEWAY
                  </h2>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-mono text-cyber-emerald">
                  <Lock className="w-3.5 h-3.5" /> Sandbox Active
                </div>
              </div>

              {/* Express 1-Click Apple Pay Simulation */}
              <div className="space-y-2">
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleApplePaySimulate}
                  className="w-full py-3.5 rounded-soft bg-white text-black font-semibold text-sm hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                >
                  <span className="font-mono text-xs font-black tracking-widest uppercase"> Pay</span>
                  <span className="text-xs font-mono text-neutral-600">
                    (Instant Simulation • {formatCurrency(grandTotal)})
                  </span>
                </button>
                <div className="flex items-center justify-center gap-3 text-xs font-mono text-titanium-500 py-1">
                  <span className="h-px bg-white/10 flex-1" />
                  <span>OR PAY WITH SIMULATED CARD</span>
                  <span className="h-px bg-white/10 flex-1" />
                </div>
              </div>

              {/* Simulated Stripe Credit Card Form */}
              <div className="p-4 rounded-soft bg-titanium-900/80 border border-white/10 space-y-4">
                {/* Test card autofill shortcuts */}
                <div className="flex items-center justify-between text-[11px] font-mono text-titanium-400 border-b border-white/5 pb-2">
                  <span>TEST CARD PRESETS:</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setCardNumber("4242 •••• •••• 4242");
                        setCardName("ALEXANDER KIM");
                      }}
                      className="text-cyber-cyan hover:underline"
                    >
                      Visa 4242
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => {
                        setCardNumber("5555 •••• •••• 4444");
                        setCardName("MARIA LOPEZ");
                      }}
                      className="text-cyber-cyan hover:underline"
                    >
                      Mastercard 4444
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-titanium-300 uppercase tracking-wider block">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-subtle titanium-input text-xs font-mono uppercase"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-titanium-300 uppercase tracking-wider block">
                    Card Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-subtle titanium-input text-xs font-mono"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 rounded bg-blue-900/40 text-[10px] font-mono text-blue-300 border border-blue-500/30">
                        VISA
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-titanium-300 uppercase tracking-wider block">
                      Expires (MM/YY)
                    </label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-subtle titanium-input text-xs font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-titanium-300 uppercase tracking-wider block">
                      CVC / CVV
                    </label>
                    <input
                      type="password"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-subtle titanium-input text-xs font-mono"
                      maxLength={4}
                    />
                  </div>
                </div>
              </div>

              {/* Complete Order Button */}
              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => handleProcessOrder("Visa ending in 4242")}
                  className="w-full py-4 rounded-subtle btn-cyber-primary font-mono text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 shadow-glow disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <div className="h-4 w-4 rounded-full border-2 border-titanium-950 border-t-transparent animate-spin" />
                      <span>DISPATCHING SECURE ORDER STATE MACHINE...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>AUTHORIZE &amp; PLACE ORDER • {formatCurrency(grandTotal)}</span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-titanium-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyber-emerald" />
                  <span>SIMULATED TRANSACTION • NO REAL CHARGES PROCESSED</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="text-xs font-mono text-titanium-400 hover:text-white flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Delivery
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Sticky Order Summary */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-6 rounded-card space-y-5 sticky top-24">
            <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-titanium-200 border-b border-white/10 pb-3 flex items-center justify-between">
              <span>ORDER TELEMETRY</span>
              <span className="text-cyber-cyan">{items.length} LINE ITEMS</span>
            </h3>

            {/* Line items mini scroll */}
            <div className="max-h-60 overflow-y-auto space-y-3 pr-1 scrollbar-none divide-y divide-white/5">
              {items.map((i) => (
                <div key={i.id} className="pt-3 first:pt-0 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-10 h-10 rounded-subtle overflow-hidden bg-titanium-900 shrink-0 border border-white/10">
                      <img src={i.image} alt={i.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium text-titanium-100 truncate">{i.name}</div>
                      <div className="font-mono text-[10px] text-titanium-400">
                        Qty {i.qty} {i.size ? `• ${i.size}` : ""}
                      </div>
                    </div>
                  </div>
                  <div className="font-mono font-bold text-titanium-200 shrink-0">
                    {formatCurrency(i.price * i.qty)}
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-2 text-xs font-mono border-t border-white/10 pt-4">
              <div className="flex justify-between text-titanium-400">
                <span>Items Subtotal</span>
                <span className="text-titanium-200">{formatCurrency(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-cyber-emerald">
                  <span>Promo Discount ({appliedPromo?.code})</span>
                  <span>-{formatCurrency(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-titanium-400">
                <span>Delivery Tier ({deliveryOptions[selectedDelivery].name})</span>
                <span className="text-titanium-200">
                  {selectedShippingFee === 0 ? "FREE" : formatCurrency(selectedShippingFee)}
                </span>
              </div>
              <div className="flex justify-between text-titanium-400">
                <span>Estimated Tax (8.25%)</span>
                <span className="text-titanium-200">{formatCurrency(tax)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-titanium-100 pt-3 border-t border-white/10">
                <span>Due Today</span>
                <span className="font-mono text-lg text-cyber-cyan">{formatCurrency(grandTotal)}</span>
              </div>
            </div>

            {/* Guaranteed Badges */}
            <div className="p-3 rounded-soft bg-white/[0.02] border border-white/5 space-y-1.5 text-[10px] font-mono text-titanium-400">
              <div className="flex items-center gap-1.5 text-titanium-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyber-emerald" />
                <span>Immediate PDF invoice &amp; QR verification generated</span>
              </div>
              <div className="flex items-center gap-1.5 text-titanium-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyber-emerald" />
                <span>30-day return warranty &amp; express replacement policy</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
