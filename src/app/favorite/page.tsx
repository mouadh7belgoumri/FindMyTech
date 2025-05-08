"use client"

import Container from "@/components/ui/Container"
import Title from "@/components/ui/Title"
import { store } from "@/lib/store"
import Image from "next/image"
import { FaTrash } from "react-icons/fa"
import Link from "next/link"
import AddToCardBtn from "@/components/ui/AddToCardBtn"

export default function FavoritePage() {
  const { favoriteProduct, removeFromFavorite } = store()

  return (
    <Container>
      <Title text="Your Favorites" />
      {favoriteProduct.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {favoriteProduct.map((item) => (
            <div key={item._id} className="border border-gray-200 rounded-lg p-4">
              <div className="relative h-48 w-full mb-4">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
              <h3 className="text-lg font-medium mb-2 line-clamp-1">{item.name}</h3>
              <div className="flex justify-between items-center mt-4">
                <AddToCardBtn product={item} />
                <button onClick={() => removeFromFavorite(item._id)} className="text-red-500 hover:text-red-700">
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-8 text-center">
          <p className="text-xl mb-6">You haven't added any favorites yet</p>
          <Link href="/product" className="bg-darkText text-white px-6 py-3 rounded-md hover:bg-black">
            Browse Products
          </Link>
        </div>
      )}
    </Container>
  )
}
