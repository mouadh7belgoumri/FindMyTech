"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Container from "@/components/ui/Container"
import { store } from "@/lib/store"
import Link from "next/link"
import Loading from "@/components/ui/Loading"
import { CheckCircle } from "lucide-react"

export default function SuccessPage() {
  const { currentUser, cartProduct, resetCart } = store()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!sessionId) {
      router.push("/")
    } else if (cartProduct.length > 0) {
      const saveOrder = async () => {
        try {
          setLoading(true)

          // Here we would typically save the order to a database
          // For now, we'll just simulate a successful order
          setTimeout(() => {
            resetCart()
            setLoading(false)
          }, 1500)
        } catch (error) {
          console.log("Error saving order data", error)
          setLoading(false)
        }
      }
      saveOrder()
    }
  }, [sessionId, router, currentUser, cartProduct, resetCart])

  return (
    <Container>
      {loading && <Loading />}
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-y-5">
        <CheckCircle className="w-20 h-20 text-green-500 mb-6" />
        <h2 className="text-2xl md:text-4xl font-bold text-center">
          {loading ? "Your order payment is processing..." : "Your Payment Accepted"}
        </h2>
        <p>{loading ? "Once done" : "Now"} you can view your Orders or continue Shopping with us</p>
        <div className="flex items-center gap-x-5">
          <Link href="/orders">
            <button className="bg-black text-slate-100 w-52 h-12 rounded-full text-base font-semibold hover:bg-primeColor duration-300">
              View Orders
            </button>
          </Link>
          <Link href="/">
            <button className="bg-black text-slate-100 w-52 h-12 rounded-full text-base font-semibold hover:bg-primeColor duration-300">
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    </Container>
  )
}
