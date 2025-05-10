"use client"

import { useEffect, useState } from "react"
import Container from "@/components/ui/Container"
import { store } from "@/lib/store"
import Loading from "@/components/ui/Loading"
import UserProfile from "@/components/ui/profile/UserProfile"
import Registration from "@/components/ui/profile/Registration"
import { getUserData } from "@/lib/api"

export default function ProfilePage() {
  const { currentUser } = store()
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Fetch user data from PHP backend
    const fetchUserData = async () => {
      setIsLoading(true)
      try {
        // Try to get user data from PHP backend
        const userData = await getUserData()

        if (userData) {
          setUser(userData)
        } else if (currentUser) {
          // Fall back to store data if available
          setUser(currentUser)
        } else {
          // No user data available
          setUser(null)
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
        // Fall back to store data if available
        if (currentUser) {
          setUser(currentUser)
        } else {
          setUser(null)
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [currentUser])

  return <Container>{isLoading ? <Loading /> : user ? <UserProfile currentUser={user} /> : <Registration />}</Container>
}
