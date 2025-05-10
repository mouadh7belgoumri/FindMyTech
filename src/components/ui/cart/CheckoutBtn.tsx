"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface CheckoutBtnProps {
  products: any[]
  totalAmt: number
}

export default function CheckoutBtn({ products, totalAmt }: CheckoutBtnProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleCheckout = async () => {
    setLoading(true)
    try {
      // In a real app, we would call the checkout API
      // For now, we'll just redirect to the success page
      setTimeout(() => {
        router.push("/success?session_id=mock_session_id")
      }, 1500)
    } catch (error) {
      console.error("Error during checkout:", error)
      setLoading(false)
    }
  }

  return (
    <div className="mt-6">
      <button
        onClick={handleCheckout}
        disabled={loading || products.length === 0}
        className="w-full rounded-md border border-transparent bg-darkText py-3 px-4 text-base font-medium text-white shadow-sm hover:bg-black focus:outline-none focus:ring-2 focus:ring-skyText focus:ring-offset-2 focus:ring-offset-gray-50 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {loading ? "Processing..." : "Checkout"}
      </button>
    </div>
  )
}
