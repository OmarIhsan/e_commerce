"use client";
import { useState } from "react";
import SizeSelector from "@/components/SizeSelector";
import AddToCartButton from "@/components/AddToCartButton";

export default function ProductActions({ product }: { product: any }) {
  const options = Array.isArray(product.attributes?.size) ? (product.attributes.size as string[]) : undefined;
  const [size, setSize] = useState<string | undefined>(options ? options[0] : undefined);

  return (
    <div>
      <SizeSelector options={options} onChange={(s) => setSize(s)} />
      <AddToCartButton product={product} size={size} />
    </div>
  );
}
