import { NextResponse } from "next/server";
import { fetchPlatziCategories } from "@/lib/platziApi";

export async function GET() {
  const categories = await fetchPlatziCategories();
  return NextResponse.json({ categories });
}
