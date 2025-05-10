"use client"

import { useState } from "react"

export default function ApiDebug() {
  const [isOpen, setIsOpen] = useState(false)
  const [apiStatus, setApiStatus] = useState<{ php: string; next: string }>({
    php: "Not tested",
    next: "Not tested",
  })
  const [isLoading, setIsLoading] = useState(false)

  const testConnections = async () => {
    setIsLoading(true)
    setApiStatus({
      php: "Testing...",
      next: "Testing...",
    })

    // Test PHP API
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || ""
      if (apiUrl) {
        const response = await fetch(`${apiUrl}/check_auth.php`, {
          cache: "no-store",
        })
        if (response.ok) {
          setApiStatus((prev) => ({ ...prev, php: "Connected ✅" }))
        } else {
          setApiStatus((prev) => ({ ...prev, php: `Error: ${response.status} ${response.statusText}` }))
        }
      } else {
        setApiStatus((prev) => ({ ...prev, php: "Error: NEXT_PUBLIC_API_URL not set" }))
      }
    } catch (error) {
      setApiStatus((prev) => ({ ...prev, php: `Failed: ${error instanceof Error ? error.message : String(error)}` }))
    }

    // Test Next.js API
    try {
      const response = await fetch("/api/products", {
        cache: "no-store",
      })
      if (response.ok) {
        setApiStatus((prev) => ({ ...prev, next: "Connected ✅" }))
      } else {
        setApiStatus((prev) => ({ ...prev, next: `Error: ${response.status} ${response.statusText}` }))
      }
    } catch (error) {
      setApiStatus((prev) => ({ ...prev, next: `Failed: ${error instanceof Error ? error.message : String(error)}` }))
    }

    setIsLoading(false)
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-gray-800 text-white p-2 rounded-full shadow-lg z-50"
        title="API Debug"
      >
        🔧
      </button>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg z-50 w-80">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold">API Connection Debug</h3>
        <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700">
          ✕
        </button>
      </div>

      <div className="space-y-2 mb-4">
        <div>
          <p className="text-sm font-medium">PHP API:</p>
          <p className="text-sm bg-gray-100 p-1 rounded">{apiStatus.php}</p>
        </div>
        <div>
          <p className="text-sm font-medium">Next.js API:</p>
          <p className="text-sm bg-gray-100 p-1 rounded">{apiStatus.next}</p>
        </div>
        <div>
          <p className="text-sm font-medium">API URL:</p>
          <p className="text-sm bg-gray-100 p-1 rounded break-all">{process.env.NEXT_PUBLIC_API_URL || "Not set"}</p>
        </div>
      </div>

      <button
        onClick={testConnections}
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
      >
        {isLoading ? "Testing..." : "Test Connections"}
      </button>
    </div>
  )
}
