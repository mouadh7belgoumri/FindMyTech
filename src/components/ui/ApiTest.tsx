"use client"

import { useState, useEffect } from "react"
import { fetchFromAPI } from "@/lib/api"

export default function ApiTest() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Try to fetch a simple endpoint from your PHP backend
        const data = await fetchFromAPI("check_auth.php")
        setStatus("success")
        setMessage(
          `Connection successful! Authentication status: ${data.authenticated ? "Authenticated" : "Not authenticated"}`,
        )
      } catch (error) {
        console.error("API connection error:", error)
        setStatus("error")
        setMessage(`Connection failed: ${error instanceof Error ? error.message : String(error)}`)
      }
    }

    testConnection()
  }, [])

  return (
    <div className="p-4 border rounded-md">
      <h2 className="text-lg font-semibold mb-2">API Connection Test</h2>
      {status === "loading" && <p className="text-gray-500">Testing connection to PHP backend...</p>}
      {status === "success" && <p className="text-green-600">{message}</p>}
      {status === "error" && <p className="text-red-600">{message}</p>}
    </div>
  )
}
