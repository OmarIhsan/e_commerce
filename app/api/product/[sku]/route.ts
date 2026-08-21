import { NextResponse } from "next/server";
import { fetchPlatziProductBySku } from "@/lib/platziApi";

export async function GET(_: Request, { params }: { params: { sku: string } }) {
  const product = await fetchPlatziProductBySku(params.sku);
  if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });
  return NextResponse.json({ product });
}
