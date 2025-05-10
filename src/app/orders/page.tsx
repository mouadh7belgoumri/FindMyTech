"use client"

import { useState, useEffect } from "react"
import Container from "@/components/ui/Container"
import Title from "@/components/ui/Title"
import { store } from "@/lib/store"
import Link from "next/link"
import Image from "next/image"
import { formatDate } from "@/lib/utils"

interface OrderItem {
  product_id: string
  product_name: string
  quantity: number
  price: number
  image?: string
}

interface Order {
  id: string
  order_number: string
  date: string
  status: string
  total: number
  items: OrderItem[]
}

export default function OrdersPage() {
  const { currentUser } = store()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true)
      setError("")

      if (!currentUser) {
        setLoading(false)
        return
      }

      try {
        // First try PHP backend
        const apiUrl = process.env.NEXT_PUBLIC_API_URL
        if (apiUrl) {
          try {
            const response = await fetch(`${apiUrl}/get_orders.php`, {
              credentials: "include", // Include cookies for session
            })

            if (response.ok) {
              const data = await response.json()
              if (data.success) {
                setOrders(data.orders || [])
                setLoading(false)
                return
              }
            }
          } catch (error) {
            console.warn("PHP API fetch failed, falling back to local API:", error)
          }
        }

        // Fallback to local Next.js API route
        const response = await fetch("/api/orders", {
          credentials: "include", // Include cookies for session
        })

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const data = await response.json()
        setOrders(data.orders || [])
      } catch (error) {
        console.error("Error fetching orders:", error)
        setError("Failed to load orders. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [currentUser])

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (!currentUser) {
    return (
      <Container>
        <div className="text-center py-12">
          <Title text="Please Sign In" />
          <p className="mt-4 mb-6">You need to be logged in to view your orders</p>
          <Link href="/Sign_in">
            <button className="bg-gray-800 text-gray-200 px-8 py-4 rounded-md hover:bg-black hover:text-white duration-200 uppercase text-sm font-semibold tracking-wide">
              Sign In
            </button>
          </Link>
        </div>
      </Container>
    )
  }

  return (
    <Container>
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
          <p className="mt-4">Loading your orders...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>
      ) : orders.length > 0 ? (
        <div className="max-w-5xl mx-auto">
          <Title text="Your Orders" />
          <p className="text-gray-600 mb-6">
            Customer:{" "}
            <span className="text-black font-semibold">
              {currentUser.firstName} {currentUser.lastName}
            </span>
          </p>

          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 p-4 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Order #{order.order_number}</p>
                    <p className="text-sm text-gray-500">Placed on {formatDate(order.date)}</p>
                  </div>
                  <div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="font-medium">Total: ${order.total.toFixed(2)}</div>
                </div>

                <div className="p-4">
                  <h3 className="font-medium mb-3">Items</h3>
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="relative h-16 w-16 flex-shrink-0">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.product_name}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div className="flex-grow">
                          <p className="font-medium">{item.product_name}</p>
                          <p className="text-sm text-gray-500">
                            Qty: {item.quantity} × ${item.price.toFixed(2)}
                          </p>
                        </div>
                        <div className="font-medium">${(item.quantity * item.price).toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center py-12">
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
