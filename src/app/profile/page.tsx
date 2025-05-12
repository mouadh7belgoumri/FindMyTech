"use client"

import { useEffect, useState } from "react"
import Container from "@/components/ui/Container"
import { store } from "@/lib/store"
import Loading from "@/components/ui/Loading"
import UserProfile from "@/components/ui/profile/UserProfile"
import Registration from "@/components/ui/profile/Registration"

export default function ProfilePage() {
  const { currentUser } = store()
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Simulate fetching user data
    const fetchUserData = async () => {
      setIsLoading(true)
      try {
        // In a real app, we would fetch user data from an API
        // For now, we'll just simulate a user or return null
        setTimeout(() => {
          // For demo purposes, let's create a mock user
          // In a real app, this would come from an API or auth service
          const mockUser = currentUser || {
            firstName: "Mouadh",
            lastName: "Belgoumri",
            email: "mo3edwahrani@gmail.com",
            avatar: "/placeholder.svg?height=80&width=80",
          }

          setUser(mockUser)
          setIsLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Error fetching user data:", error)
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [currentUser])

  return <Container>{isLoading ? <Loading /> : user ? <UserProfile currentUser={user} /> : <Registration />}</Container>
}
