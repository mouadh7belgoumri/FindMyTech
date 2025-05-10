"use client"

import { useState } from "react"
import Image from "next/image"
import { store } from "@/lib/store"
import { useRouter } from "next/navigation"

interface UserProfileProps {
  currentUser: any
}

export default function UserProfile({ currentUser }: UserProfileProps) {
  const [loading, setLoading] = useState(false)
  const { setCurrentUser } = store()
  const router = useRouter()

  const handleLogout = async () => {
    setLoading(true)

    try {
      // First try PHP backend
      const apiUrl = process.env.NEXT_PUBLIC_API_URL
      if (apiUrl) {
        try {
          const response = await fetch(`${apiUrl}/logout.php`, {
            method: "POST",
            credentials: "include",
          })

          if (response.ok) {
            // Logout successful
            setCurrentUser(null)
            router.push("/")
            return
          }
        } catch (error) {
          console.warn("PHP API logout failed, falling back to local API:", error)
        }
      }

      // Fallback to Next.js API route
      await fetch("/api/auth/logout", {
        method: "POST",
      })

      // Clear user from store
      setCurrentUser(null)
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setLoading(false)
    }
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
              <p className="font-medium">
                {currentUser?.createdAt
                  ? new Date(currentUser.createdAt).toLocaleDateString()
                  : new Date().toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <button
              onClick={handleLogout}
              disabled={loading}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:bg-gray-400"
            >
              {loading ? "Logging out..." : "Logout"}
            </button>

            <button
              onClick={() => router.push("/profile/edit")}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
