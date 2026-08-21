import { NextResponse } from "next/server";
import { fetchPlatziProducts } from "@/lib/platziApi";

export async function GET() {
  const products = await fetchPlatziProducts();
  return NextResponse.json({ products });
}
