"use client"

import { useState, useEffect } from "react"
import Container from "@/components/ui/Container"
import Title from "@/components/ui/Title"
import { store } from "@/lib/store"
import Link from "next/link"
import Loading from "@/components/ui/Loading"

export default function OrdersPage() {
  const { currentUser } = store()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // In a real app, we would fetch orders from an API
    // For now, we'll just simulate loading
    const fetchOrders = async () => {
      setLoading(true)
      // Simulate API call
      setTimeout(() => {
        setOrders([])
        setLoading(false)
      }, 1000)
    }

    if (currentUser) {
      fetchOrders()
    }
  }, [currentUser])

  return (
    <Container>
      {loading ? (
        <Loading />
      ) : orders?.length > 0 ? (
        <div className="max-w-5xl mx-auto">
          <Title text="Your Orders" />
          <p className="text-gray-600">
            Customer Name:{" "}
            <span className="text-black font-semibold">
              {currentUser?.firstName} {currentUser?.lastName}
            </span>
          </p>
          <p className="text-gray-600">
            Total Orders: <span className="text-black font-semibold">{orders?.length}</span>
          </p>
          <div className="flex flex-col gap-3 mt-6">{/* Order list would go here */}</div>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <Title text="No orders yet" />
          <p className="mt-4 mb-6">You haven't placed any orders yet</p>
          <Link href="/product">
            <button className="bg-gray-800 text-gray-200 px-8 py-4 rounded-md hover:bg-black hover:text-white duration-200 uppercase text-sm font-semibold tracking-wide">
              Start Shopping
            </button>
          </Link>
        </div>
      )}
    </Container>
  )
}
