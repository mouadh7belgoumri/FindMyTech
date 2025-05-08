"use client"

import { useState } from "react"
import Image from "next/image"
import { store } from "@/lib/store"

interface UserProfileProps {
  currentUser: any
}

export default function UserProfile({ currentUser }: UserProfileProps) {
  const [loading, setLoading] = useState(false)
  const { resetCart } = store()

  const handleLogout = () => {
    setLoading(true)
    // In a real app, we would call an auth service to log out
    setTimeout(() => {
      resetCart()
      window.location.reload()
    }, 1000)
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="bg-gray-100 p-6">
          <div className="flex items-center space-x-4">
            <div className="relative h-20 w-20 rounded-full overflow-hidden">
              <Image
                src={currentUser?.avatar || "/placeholder.svg?height=80&width=80"}
                alt="User avatar"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold">
                {currentUser?.firstName} {currentUser?.lastName}
              </h2>
              <p className="text-gray-600">{currentUser?.email}</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-xl font-semibold mb-4">Account Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">First Name</p>
              <p className="font-medium">{currentUser?.firstName}</p>
            </div>
            <div>
              <p className="text-gray-600">Last Name</p>
              <p className="font-medium">{currentUser?.lastName}</p>
            </div>
            <div>
              <p className="text-gray-600">Email</p>
              <p className="font-medium">{currentUser?.email}</p>
            </div>
            <div>
              <p className="text-gray-600">Member Since</p>
              <p className="font-medium">{new Date().toLocaleDateString()}</p>
            </div>
          </div>

          <div className="mt-8">
            <button
              onClick={handleLogout}
              disabled={loading}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:bg-gray-400"
            >
              {loading ? "Logging out..." : "Logout"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
