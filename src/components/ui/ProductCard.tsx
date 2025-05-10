"use client"

import type React from "react"

import Link from "next/link"
import Image from "next/image"
import { FiHeart } from "react-icons/fi"
import { store } from "@/lib/store"
import toast from "react-hot-toast"
import AddToCardBtn from "./AddToCardBtn"

interface ProductProps {
  _id: string
  name: string
  image: string
  regularPrice: number
  discountedPrice: number
  isNew: boolean
  [key: string]: any
}

interface ProductCardProps {
  item: ProductProps
  setSearchText?: React.Dispatch<React.SetStateAction<string>>
}

const ProductCard = ({ item, setSearchText }: ProductCardProps) => {
  const { addToFavorite, favoriteProduct } = store()

  const handleAddToFavorite = () => {
    const existingProduct = favoriteProduct.find((p) => p._id === item._id)
    if (existingProduct) {
      toast.error(`${item.name.substring(0, 10)} already added to favorites!`)
    } else {
      addToFavorite(item)
      toast.success(`${item.name.substring(0, 10)} added to favorites!`)
    }
  }

  return (
    <div className="group relative" key={item?._id}>
      <div className="overflow-hidden">
        <Link
          href={`/product/${item?._id}`}
          onClick={() => setSearchText && setSearchText("")}
          className="relative block h-64 w-full"
        >
          <Image
            src={item?.image || "/placeholder.svg"}
            alt="product-image"
            fill
            className="object-cover group-hover:scale-110 duration-300"
          />
        </Link>
      </div>
      {item?.isNew && (
        <div className="absolute top-2 right-2 z-10">
          <p className="bg-greenText text-white text-xs font-semibold py-1 px-3 rounded-full">New Arrival</p>
        </div>
      )}
      <div className="mt-3 flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">{item?.category}</p>
          {item?.brand && <p className="text-sm font-medium">{item.brand}</p>}
        </div>
        <Link
          href={`/product/${item?._id}`}
          onClick={() => setSearchText && setSearchText("")}
          className="font-medium line-clamp-1 hover:text-skyText duration-300"
        >
          {item?.name}
        </Link>
        <div className="flex items-center justify-between">
          <AddToCardBtn product={item} />
          <div
            onClick={handleAddToFavorite}
            className="w-8 h-8 rounded-full flex items-center justify-center border border-gray-300 hover:border-gray-900 cursor-pointer"
          >
            <FiHeart className="hover:text-red-600 duration-300" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
