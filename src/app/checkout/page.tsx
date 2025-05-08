"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Container from "@/components/ui/Container"
import Title from "@/components/ui/Title"
import { store } from "@/lib/store"
import FormattedPrice from "@/components/ui/FormattedPrice"
import { useForm } from "react-hook-form"

interface CheckoutFormData {
  name: string
  email: string
  address: string
  city: string
  postalCode: string
  country: string
}

export default function CheckoutPage() {
  const { cartProduct } = store()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>()

  const totalAmount = cartProduct.reduce((total, item) => {
    return total + item.discountedPrice * item.quantity
  }, 0)

  const onSubmit = async (data: CheckoutFormData) => {
    if (cartProduct.length === 0) {
      alert("Your cart is empty!")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cartProduct,
          email: data.email,
        }),
      })

      const responseData = await response.json()

      if (responseData.success) {
        // Redirect to Stripe checkout
        window.location.href = `https://checkout.stripe.com/pay/${responseData.id}`
      } else {
        alert("Something went wrong with the checkout process.")
      }
    } catch (error) {
      console.error("Checkout error:", error)
      alert("An error occurred during checkout.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container>
      <Title text="Checkout" />
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <h3 className="text-xl font-semibold mb-4">Shipping Information</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                {...register("name", { required: "Name is required" })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                type="text"
                id="address"
                {...register("address", { required: "Address is required" })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
              />
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  {...register("city", { required: "City is required" })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                />
                {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
              </div>

              <div>
                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                  Postal Code
                </label>
                <input
                  type="text"
                  id="postalCode"
                  {...register("postalCode", { required: "Postal code is required" })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                />
                {errors.postalCode && <p className="text-red-500 text-xs mt-1">{errors.postalCode.message}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                Country
              </label>
              <input
                type="text"
                id="country"
                {...register("country", { required: "Country is required" })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
              />
              {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-darkText text-white py-3 rounded-md hover:bg-black disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : "Proceed to Payment"}
            </button>
          </form>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
          <div className="space-y-4 mb-6">
            {cartProduct.map((item) => (
              <div key={item._id} className="flex justify-between">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
                <FormattedPrice amount={item.discountedPrice * item.quantity} />
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <FormattedPrice amount={totalAmount} />
            </div>
            <div className="flex justify-between mb-2">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="border-t border-gray-200 my-4"></div>
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <FormattedPrice amount={totalAmount} />
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}
