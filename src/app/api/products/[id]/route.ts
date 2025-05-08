import { products } from "@/lib/constants"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const productId = params.id
  const product = products.find((item) => item._id === productId)

  if (!product) {
    return NextResponse.json({ message: "Product not found" }, { status: 404 })
  }

  return NextResponse.json(product)
}
