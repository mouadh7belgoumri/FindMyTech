"use client"

import { useState } from "react"

export default function ServerStatus() {
  const [isOpen, setIsOpen] = useState(false)
  const [envVars, setEnvVars] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const checkEnvVars = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/env-check")
      const data = await response.json()
      setEnvVars(data)
    } catch (error) {
      console.error("Error checking environment variables:", error)
      setEnvVars({ error: error instanceof Error ? error.message : String(error) })
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 bg-gray-800 text-white p-2 rounded-full shadow-lg z-50"
        title="Server Status"
      >
        🖥️
      </button>
    )
  }

  return (
    <div className="fixed bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg z-50 w-80">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold">Server Status</h3>
        <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700">
          ✕
        </button>
      </div>

      <div className="space-y-2 mb-4">
        <p className="text-sm font-medium">Environment Variables:</p>
        {Object.keys(envVars).length > 0 ? (
          <div className="text-sm bg-gray-100 p-2 rounded max-h-40 overflow-y-auto">
            {Object.entries(envVars).map(([key, value]) => (
              <div key={key} className="mb-1">
                <span className="font-medium">{key}:</span> {value}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">Click "Check Server" to view environment variables</p>
        )}
      </div>

      <button
        onClick={checkEnvVars}
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
      >
        {isLoading ? "Checking..." : "Check Server"}
      </button>
    </div>
  )
}
