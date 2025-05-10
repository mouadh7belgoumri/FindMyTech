import { NextResponse } from "next/server"
import { products } from "@/lib/constants"

export async function GET() {
  // This is a fallback API route that returns mock data
  // when the PHP backend is not available
  return NextResponse.json(products)
}
