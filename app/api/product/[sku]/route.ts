import { NextResponse } from "next/server";
import { findBySku } from "@/lib/mockData";

export async function GET(_: Request, { params }: { params: { sku: string } }) {
  const product = findBySku(params.sku);
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ product });
}
