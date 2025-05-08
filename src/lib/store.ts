"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface ProductProps {
  _id: string
  name: string
  regularPrice: number
  discountedPrice: number
  quantity: number
  [key: string]: any
}

interface StoreState {
  cartProduct: ProductProps[]
  favoriteProduct: ProductProps[]
  currentUser: any | null
  isLoading: boolean
  addToCart: (product: ProductProps) => void
  addToFavorite: (product: ProductProps) => void
  increaseQuantity: (id: string) => void
  decreaseQuantity: (id: string) => void
  removeFromCart: (id: string) => void
  removeFromFavorite: (id: string) => void
  resetCart: () => void
}

export const store = create<StoreState>()(
  persist(
    (set) => ({
      cartProduct: [],
      favoriteProduct: [],
      currentUser: null,
      isLoading: false,

      addToCart: (product) => {
        set((state) => {
          const existingProduct = state.cartProduct.find((item) => item._id === product._id)

          if (existingProduct) {
            const updatedCart = state.cartProduct.map((item) => {
              if (item._id === product._id) {
                return { ...item, quantity: item.quantity + 1 }
              }
              return item
            })
            return { cartProduct: updatedCart }
          } else {
            return { cartProduct: [...state.cartProduct, { ...product, quantity: 1 }] }
          }
        })
      },

      addToFavorite: (product) => {
        set((state) => {
          const existingProduct = state.favoriteProduct.find((item) => item._id === product._id)

          if (existingProduct) {
            return state
          } else {
            return { favoriteProduct: [...state.favoriteProduct, { ...product }] }
          }
        })
      },

      increaseQuantity: (id) => {
        set((state) => {
          const updatedCart = state.cartProduct.map((item) => {
            if (item._id === id) {
              return { ...item, quantity: item.quantity + 1 }
            }
            return item
          })
          return { cartProduct: updatedCart }
        })
      },

      decreaseQuantity: (id) => {
        set((state) => {
          const existingProduct = state.cartProduct.find((item) => item._id === id)

          if (existingProduct?.quantity === 1) {
            const updatedCart = state.cartProduct.filter((item) => item._id !== id)
            return { cartProduct: updatedCart }
          } else {
            const updatedCart = state.cartProduct.map((item) => {
              if (item._id === id) {
                return { ...item, quantity: item.quantity - 1 }
              }
              return item
            })
            return { cartProduct: updatedCart }
          }
        })
      },

      removeFromCart: (id) => {
        set((state) => {
          const updatedCart = state.cartProduct.filter((item) => item._id !== id)
          return { cartProduct: updatedCart }
        })
      },

      removeFromFavorite: (id) => {
        set((state) => {
          const updatedFavorite = state.favoriteProduct.filter((item) => item._id !== id)
          return { favoriteProduct: updatedFavorite }
        })
      },

      resetCart: () => {
        set({ cartProduct: [] })
      },
    }),
    {
      name: "ecommerce-store",
    },
  ),
)
