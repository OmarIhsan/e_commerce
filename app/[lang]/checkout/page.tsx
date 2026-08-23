"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/cartStore";
import { generateOrderId, FREE_SHIPPING_THRESHOLD } from "@/lib/utils";
import { useCurrencyStore } from "@/lib/currencyStore";
import { useEcomI18n } from "@/lib/i18n";
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
  ShoppingBag,
  Sparkles
} from "lucide-react";
import Link from "next/link";

const shippingSchema = z.object({
  email: z.string().email("Valid email required"),
  firstName: z.string().min(2, "First name required"),
  lastName: z.string().min(2, "Last name required"),
  address: z.string().min(4, "Address required"),
  apartment: z.string().optional(),
  city: z.string().min(2, "City required"),
  state: z.string().min(2, "State/Region required"),
  postalCode: z.string().min(2, "Postal code required"),
  country: z.string().min(2, "Country required"),
  phone: z.string().min(6, "Phone number required"),
});

type ShippingFormData = z.infer<typeof shippingSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const { success, error } = useToast();
  const { locale, dir, t } = useEcomI18n();
  const isRtl = dir === "rtl";
  const formatPrice = useCurrencyStore((s) => s.formatPrice);

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
  const [cardName, setCardName] = useState("Alex Morgan");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => setMounted(true), []);

  const subtotal = getSubtotal();
  const discount = getDiscountAmount();

  // Delivery costs
  const deliveryOptions = {
    economy: {
      id: "economy",
      name: t.checkout.economy,
      time: t.checkout.economyTime,
      cost: subtotal >= FREE_SHIPPING_THRESHOLD || appliedPromo?.discountType === "freeship" ? 0 : 4.0,
    },
    standard: {
      id: "standard",
      name: t.checkout.standard,
      time: t.checkout.standardTime,
      cost: subtotal >= FREE_SHIPPING_THRESHOLD || appliedPromo?.discountType === "freeship" ? 0 : 6.0,
    },
    express: {
      id: "express",
      name: t.checkout.express,
      time: t.checkout.expressTime,
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
    formState: { errors, isValid },
  } = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
    mode: "onChange",
    defaultValues: {
      email: "customer@example.com",
      firstName: "Alex",
      lastName: "Morgan",
      address: "123 Main Street",
      city: "Paris",
      state: "Île-de-France",
      postalCode: "75001",
      country: "France",
      phone: "+33 6 12 34 56 78",
    },
  });

  const shippingFormValues = watch();

  const handleShippingSubmit = () => {
    setCurrentStep(2);
  };

  const handleProcessOrder = (paymentMethodName: string = "Credit Card •••• 4242") => {
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
      success(t.confirmation.title);
      router.push(`/${locale}/confirmation?orderId=${orderId}`);
    }, 1000);
  };

  if (!mounted || !hasHydrated) {
    return (
      <div className="py-24 text-center text-xs text-slate-400 dark:text-titanium-400">
        Loading checkout...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="p-12 rounded-2xl bg-white dark:bg-titanium-900 border border-slate-200 dark:border-white/10 text-center max-w-lg mx-auto space-y-6 my-8 shadow-xs">
        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center mx-auto text-slate-400 dark:text-titanium-400">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">
          {t.cart.empty}
        </h1>
        <p className="text-xs text-slate-500 dark:text-titanium-400">
          {t.cart.emptyDesc}
        </p>
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
        >
          {t.cart.startShopping}
        </Link>
      </div>
    );
  }

  const NextArrow = isRtl ? ArrowLeft : ArrowRight;
  const BackArrow = isRtl ? ArrowRight : ArrowLeft;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Checkout Progress Stepper Bar */}
      <div className="p-4 rounded-xl bg-white dark:bg-titanium-900 border border-slate-200 dark:border-white/10 shadow-xs">
        <div className="grid grid-cols-3 gap-2">
          {/* Step 1 */}
          <button
            onClick={() => setCurrentStep(1)}
            className={`flex items-center justify-center gap-2 p-2.5 rounded-lg text-xs transition-all cursor-pointer ${
              currentStep === 1
                ? "bg-blue-50 dark:bg-blue-600/20 border border-blue-500 text-blue-600 dark:text-blue-400 font-bold"
                : currentStep > 1
                ? "bg-slate-50 dark:bg-white/5 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-semibold"
                : "text-slate-400 dark:text-titanium-500"
            }`}
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 dark:bg-white/10 text-[10px]">
              {currentStep > 1 ? <Check className="w-3 h-3" /> : "1"}
            </span>
            <span className="hidden sm:inline">{t.checkout.step1}</span>
          </button>

          {/* Step 2 */}
          <button
            onClick={() => {
              if (isValid) setCurrentStep(2);
            }}
            disabled={!isValid}
            className={`flex items-center justify-center gap-2 p-2.5 rounded-lg text-xs transition-all cursor-pointer ${
              currentStep === 2
                ? "bg-blue-50 dark:bg-blue-600/20 border border-blue-500 text-blue-600 dark:text-blue-400 font-bold"
                : currentStep > 2
                ? "bg-slate-50 dark:bg-white/5 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-semibold"
                : "text-slate-400 dark:text-titanium-500 opacity-60"
            }`}
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 dark:bg-white/10 text-[10px]">
              {currentStep > 2 ? <Check className="w-3 h-3" /> : "2"}
            </span>
            <span className="hidden sm:inline">{t.checkout.step2}</span>
          </button>

          {/* Step 3 */}
          <button
            onClick={() => {
              if (isValid) setCurrentStep(3);
            }}
            disabled={!isValid}
            className={`flex items-center justify-center gap-2 p-2.5 rounded-lg text-xs transition-all cursor-pointer ${
              currentStep === 3
                ? "bg-blue-50 dark:bg-blue-600/20 border border-blue-500 text-blue-600 dark:text-blue-400 font-bold"
                : "text-slate-400 dark:text-titanium-500 opacity-60"
            }`}
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 dark:bg-white/10 text-[10px]">
              3
            </span>
            <span className="hidden sm:inline">{t.checkout.step3}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Form Steps on Left, Sticky Summary on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Form Steps */}
        <div className="lg:col-span-7 space-y-6">
          {/* STEP 1: Shipping Address Form */}
          {currentStep === 1 && (
            <form onSubmit={handleSubmit(handleShippingSubmit)} className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-titanium-900 border border-slate-200 dark:border-white/10 space-y-6 animate-in fade-in duration-200 shadow-xs">
              <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-4">
                <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    {t.checkout.contactInfo}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-titanium-400">
                    {t.checkout.step1}
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                {/* Email */}
                <div className="space-y-1">
                  <label className="text-slate-700 dark:text-titanium-300 font-medium">{t.checkout.email}</label>
                  <input
                    type="email"
                    {...register("email")}
                    className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-titanium-950 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-titanium-100 text-xs focus:outline-none focus:border-blue-500"
                  />
                  {errors.email && (
                    <p className="text-rose-500 text-[11px]">{errors.email.message}</p>
                  )}
                </div>

                {/* Name Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-slate-700 dark:text-titanium-300 font-medium">{t.checkout.firstName}</label>
                    <input
                      type="text"
                      {...register("firstName")}
                      className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-titanium-950 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-titanium-100 text-xs focus:outline-none focus:border-blue-500"
                    />
                    {errors.firstName && (
                      <p className="text-rose-500 text-[11px]">{errors.firstName.message}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-700 dark:text-titanium-300 font-medium">{t.checkout.lastName}</label>
                    <input
                      type="text"
                      {...register("lastName")}
                      className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-titanium-950 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-titanium-100 text-xs focus:outline-none focus:border-blue-500"
                    />
                    {errors.lastName && (
                      <p className="text-rose-500 text-[11px]">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-1">
                  <label className="text-slate-700 dark:text-titanium-300 font-medium">{t.checkout.address}</label>
                  <input
                    type="text"
                    {...register("address")}
                    className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-titanium-950 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-titanium-100 text-xs focus:outline-none focus:border-blue-500"
                  />
                  {errors.address && (
                    <p className="text-rose-500 text-[11px]">{errors.address.message}</p>
                  )}
                </div>

                {/* Apartment */}
                <div className="space-y-1">
                  <label className="text-slate-700 dark:text-titanium-300 font-medium">{t.checkout.apartment}</label>
                  <input
                    type="text"
                    {...register("apartment")}
                    className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-titanium-950 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-titanium-100 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* City, State, Postal Code */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-slate-700 dark:text-titanium-300 font-medium">{t.checkout.city}</label>
                    <input
                      type="text"
                      {...register("city")}
                      className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-titanium-950 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-titanium-100 text-xs focus:outline-none focus:border-blue-500"
                    />
                    {errors.city && (
                      <p className="text-rose-500 text-[11px]">{errors.city.message}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-700 dark:text-titanium-300 font-medium">{t.checkout.state}</label>
                    <input
                      type="text"
                      {...register("state")}
                      className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-titanium-950 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-titanium-100 text-xs focus:outline-none focus:border-blue-500"
                    />
                    {errors.state && (
                      <p className="text-rose-500 text-[11px]">{errors.state.message}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-700 dark:text-titanium-300 font-medium">{t.checkout.postalCode}</label>
                    <input
                      type="text"
                      {...register("postalCode")}
                      className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-titanium-950 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-titanium-100 text-xs focus:outline-none focus:border-blue-500"
                    />
                    {errors.postalCode && (
                      <p className="text-rose-500 text-[11px]">{errors.postalCode.message}</p>
                    )}
                  </div>
                </div>

                {/* Country and Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-slate-700 dark:text-titanium-300 font-medium">{t.checkout.country}</label>
                    <input
                      type="text"
                      {...register("country")}
                      className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-titanium-950 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-titanium-100 text-xs focus:outline-none focus:border-blue-500"
                    />
                    {errors.country && (
                      <p className="text-rose-500 text-[11px]">{errors.country.message}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-700 dark:text-titanium-300 font-medium">{t.checkout.phone}</label>
                    <input
                      type="tel"
                      {...register("phone")}
                      className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-titanium-950 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-titanium-100 text-xs focus:outline-none focus:border-blue-500"
                    />
                    {errors.phone && (
                      <p className="text-rose-500 text-[11px]">{errors.phone.message}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end">
                <button
                  type="submit"
                  disabled={!isValid}
                  className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors disabled:opacity-40 cursor-pointer"
                >
                  <span>{t.checkout.continueToDelivery}</span>
                  <NextArrow className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Delivery Method Selection */}
          {currentStep === 2 && (
            <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-titanium-900 border border-slate-200 dark:border-white/10 space-y-6 animate-in fade-in duration-200 shadow-xs">
              <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-4">
                <Truck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    {t.checkout.deliveryMethod}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-titanium-400">
                    {t.checkout.step2}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {(["economy", "standard", "express"] as const).map((method) => {
                  const opt = deliveryOptions[method];
                  const isSelected = selectedDelivery === method;
                  return (
                    <div
                      key={method}
                      onClick={() => setSelectedDelivery(method)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? "bg-blue-50 dark:bg-blue-600/10 border-blue-500 shadow-xs"
                          : "bg-slate-50 dark:bg-titanium-950/60 border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/15"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected
                              ? "border-blue-500 bg-blue-500 text-white"
                              : "border-slate-300 dark:border-white/20"
                          }`}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white">{opt.name}</h4>
                          <p className="text-[11px] text-slate-500 dark:text-titanium-400">{opt.time}</p>
                        </div>
                      </div>
                      <div className="text-end">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {opt.cost === 0 ? (
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold">{t.cart.free}</span>
                          ) : (
                            formatPrice(opt.cost)
                          )}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-slate-200 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="text-xs text-slate-500 hover:text-slate-800 dark:text-titanium-400 dark:hover:text-white flex items-center gap-1.5 cursor-pointer"
                >
                  <BackArrow className="w-3.5 h-3.5" />
                  <span>{t.checkout.backStep}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
                >
                  <span>{t.checkout.continueToPayment}</span>
                  <NextArrow className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Payment */}
          {currentStep === 3 && (
            <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-titanium-900 border border-slate-200 dark:border-white/10 space-y-6 animate-in fade-in duration-200 shadow-xs">
              <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-4">
                <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    {t.checkout.paymentInfo}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-titanium-400">
                    {t.checkout.step3}
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="text-slate-700 dark:text-titanium-300 font-medium">{t.checkout.cardName}</label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-titanium-950 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-titanium-100 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 dark:text-titanium-300 font-medium">{t.checkout.cardNumber}</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-titanium-950 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-titanium-100 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-slate-700 dark:text-titanium-300 font-medium">{t.checkout.expiry}</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-titanium-950 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-titanium-100 text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-700 dark:text-titanium-300 font-medium">{t.checkout.cvc}</label>
                    <input
                      type="text"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-titanium-950 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-titanium-100 text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-slate-200 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="text-xs text-slate-500 hover:text-slate-800 dark:text-titanium-400 dark:hover:text-white flex items-center gap-1.5 cursor-pointer"
                >
                  <BackArrow className="w-3.5 h-3.5" />
                  <span>{t.checkout.backStep}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleProcessOrder("Credit Card Ending in 4242")}
                  disabled={isProcessing}
                  className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-colors disabled:opacity-50 min-h-[44px] cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{isProcessing ? t.checkout.processing : `${t.checkout.placeOrder} (${formatPrice(grandTotal)})`}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-titanium-900 border border-slate-200 dark:border-white/10 space-y-5 sticky top-24 shadow-xs">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white border-b border-slate-200 dark:border-white/10 pb-3">
              {t.checkout.orderSummary} ({items.reduce((s, i) => s + i.qty, 0)})
            </h3>

            {/* Item Mini List */}
            <div className="space-y-3 max-h-64 overflow-y-auto pe-1" style={{ scrollbarWidth: "thin" }}>
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 text-xs">
                  <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-titanium-950 overflow-hidden shrink-0 border border-slate-200 dark:border-white/5">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-semibold text-slate-900 dark:text-white truncate">{item.name}</h5>
                    <p className="text-[11px] text-slate-500 dark:text-titanium-400">
                      {t.product.quantity}: {item.qty} {item.size && `• ${item.size}`}
                    </p>
                  </div>
                  <span className="font-semibold text-slate-900 dark:text-white">{formatPrice(item.price * item.qty)}</span>
                </div>
              ))}
            </div>

            {/* Totals Breakdown */}
            <div className="space-y-2 text-xs pt-3 border-t border-slate-200 dark:border-white/10">
              <div className="flex justify-between text-slate-600 dark:text-titanium-300">
                <span>{t.cart.subtotal}</span>
                <span className="font-semibold text-slate-900 dark:text-white">{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>{t.cart.discount}</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600 dark:text-titanium-300">
                <span>{t.cart.shipping}</span>
                <span>
                  {selectedShippingFee === 0 ? (
                    <strong className="text-emerald-600 dark:text-emerald-400">{t.cart.free}</strong>
                  ) : (
                    formatPrice(selectedShippingFee)
                  )}
                </span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-titanium-300">
                <span>{t.cart.tax}</span>
                <span>{formatPrice(tax)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-white/10">
                <span>{t.cart.total}</span>
                <span className="text-xl text-blue-600 dark:text-blue-400">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            {/* Security Badge */}
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-titanium-950 border border-slate-200 dark:border-white/5 flex items-center gap-2 text-xs text-slate-600 dark:text-titanium-300">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{t.benefits.securityTitle} - 256-bit SSL</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
