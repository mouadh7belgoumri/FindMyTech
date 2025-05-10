"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { FaTrash } from "react-icons/fa"
import { store } from "@/lib/store"
import FormattedPrice from "@/components/ui/FormattedPrice"

interface CartProductProps {
  product: any
}

export default function CartProduct({ product }: CartProductProps) {
  const { removeFromCart, increaseQuantity, decreaseQuantity } = store()
  const [quantity, setQuantity] = useState(product.quantity)

  const handleIncrease = () => {
    increaseQuantity(product._id)
    setQuantity((prev) => prev + 1)
  }

  const handleDecrease = () => {
    if (quantity > 1) {
      decreaseQuantity(product._id)
      setQuantity((prev) => prev - 1)
    }
  }

  return (
    <div className="flex py-6 sm:py-10">
      <div className="flex-shrink-0">
        <div className="relative h-24 w-24 sm:h-32 sm:w-32">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover object-center rounded-md"
          />
        </div>
      </div>

      <div className="ml-4 flex flex-1 flex-col sm:ml-6">
        <div>
          <div className="flex justify-between">
            <h4 className="text-sm">
              <Link href={`/product/${product._id}`} className="font-medium text-gray-700 hover:text-gray-800">
                {product.name}
              </Link>
            </h4>
            <p className="ml-4 text-sm font-medium text-gray-900">
              <FormattedPrice amount={product.discountedPrice * product.quantity} />
            </p>
          </div>
          <p className="mt-1 text-sm text-gray-500 line-clamp-2">{product.description}</p>
          {product.brand && <p className="mt-1 text-sm text-gray-500">Brand: {product.brand}</p>}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button onClick={handleDecrease} className="rounded-full bg-gray-200 p-1 text-gray-600 hover:bg-gray-300">
              -
            </button>
            <span className="text-gray-700">{quantity}</span>
            <button onClick={handleIncrease} className="rounded-full bg-gray-200 p-1 text-gray-600 hover:bg-gray-300">
              +
            </button>
          </div>
          <button
            type="button"
            onClick={() => removeFromCart(product._id)}
            className="text-sm font-medium text-red-600 hover:text-red-500 flex items-center"
          >
            <FaTrash className="mr-1" />
            Remove
          </button>
        </div>
      </div>
    </div>
  )
}
