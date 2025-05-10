import { products } from "@/lib/constants"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id
  const matchedProducts = products?.filter((item) => item?._base === id)

  if (!matchedProducts || matchedProducts.length === 0) {
    return NextResponse.json({ message: "No products matched with this category" }, { status: 404 })
  }

  return NextResponse.json(matchedProducts)
}
