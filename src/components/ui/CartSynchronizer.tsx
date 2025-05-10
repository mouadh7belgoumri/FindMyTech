"use client"

import { useEffect } from "react"
import { store } from "@/lib/store"
import { fetchFromAPI } from "@/lib/api"

export default function CartSynchronizer() {
  const { cartProduct, setCartProducts } = store()

  // Synchronize cart with backend on component mount
  useEffect(() => {
    const syncCart = async () => {
      try {
        const response = await fetchFromAPI("get_cart.php")

        if (response.success && response.cart) {
          // Update local cart with server cart
          setCartProducts(response.cart)
        }
      } catch (error) {
        console.error("Failed to sync cart:", error)
      }
    }

    syncCart()
  }, [setCartProducts])

  return null // This component doesn't render anything
}
