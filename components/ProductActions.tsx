"use client";

import { useState } from "react";
import { Product } from "@/lib/mockData";
import SizeSelector from "@/components/SizeSelector";
import AddToCartButton from "@/components/AddToCartButton";
import { Plus, Minus, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/utils";
import { useEcomI18n } from "@/lib/i18n";

export default function ProductActions({ product }: { product: Product }) {
  const { t } = useEcomI18n();
  const sizeOptions = Array.isArray(product.attributes?.size)
    ? (product.attributes?.size as string[])
    : undefined;
  const colorOptions = Array.isArray(product.attributes?.color)
    ? (product.attributes?.color as string[])
    : undefined;

  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    sizeOptions ? sizeOptions[0] : undefined
  );
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    colorOptions ? colorOptions[0] : undefined
  );
  const [qty, setQty] = useState(1);

  const handleQtyChange = (delta: number) => {
    const next = qty + delta;
    if (next >= 1 && next <= product.inventory) {
      setQty(next);
    }
  };

  return (
    <div className="space-y-6 pt-4 border-t border-white/10">
      {/* Variant selectors */}
      {colorOptions && (
        <SizeSelector
          label={t.product.selectColor}
          options={colorOptions}
          selected={selectedColor}
          onChange={setSelectedColor}
        />
      )}

      {sizeOptions && (
        <SizeSelector
          label={t.product.selectSize}
          options={sizeOptions}
          selected={selectedSize}
          onChange={setSelectedSize}
        />
      )}

      {/* Quantity + Add to Cart Row */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        {/* Quantity Stepper */}
        <div className="flex items-center justify-between rounded-lg bg-titanium-900 border border-white/10 px-3 py-2 sm:w-36">
          <span className="text-xs text-titanium-400 font-medium">{t.product.quantity}</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleQtyChange(-1)}
              disabled={qty <= 1}
              className="p-1 text-titanium-400 hover:text-white disabled:opacity-30 transition-colors cursor-pointer"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-bold text-white w-6 text-center">
              {qty}
            </span>
            <button
              type="button"
              onClick={() => handleQtyChange(1)}
              disabled={qty >= product.inventory}
              className="p-1 text-titanium-400 hover:text-white disabled:opacity-30 transition-colors cursor-pointer"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Add to Cart CTA */}
        <AddToCartButton
          product={product}
          qty={qty}
          size={selectedSize}
          color={selectedColor}
          showPrice={true}
          className="flex-1 py-3 px-6"
        />
      </div>

      {/* Stock warning pill */}
      {product.inventory > 0 && product.inventory <= 5 && (
        <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-amber-400 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping"></span>
          <span>{t.product.lowStockWarning}</span>
        </div>
      )}

      {/* Trust & Dispatch Guarantee Specs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        <div className="p-3 rounded-lg bg-titanium-900/60 border border-white/5 flex items-start gap-2.5">
          <Truck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <div className="text-[11px]">
            <div className="font-semibold text-white">
              {product.price >= FREE_SHIPPING_THRESHOLD ? t.benefits.shippingTitle : t.checkout.standard}
            </div>
            <div className="text-titanium-400">{t.benefits.shippingDesc}</div>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-titanium-900/60 border border-white/5 flex items-start gap-2.5">
          <RotateCcw className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-[11px]">
            <div className="font-semibold text-white">{t.product.easyReturns}</div>
            <div className="text-titanium-400">{t.benefits.returnsDesc}</div>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-titanium-900/60 border border-white/5 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-[11px]">
            <div className="font-semibold text-white">{t.product.verifiedItem}</div>
            <div className="text-titanium-400">{t.benefits.qualityDesc}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
