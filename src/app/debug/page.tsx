"use client"

import { useState, useEffect } from "react"
import Container from "@/components/ui/Container"

export default function DebugPage() {
  const [apiUrl, setApiUrl] = useState("")
  const [appUrl, setAppUrl] = useState("")
  const [imagePath, setImagePath] = useState("")
  const [testResults, setTestResults] = useState<{ endpoint: string; status: string; message: string }[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Get environment variables
    setApiUrl(process.env.NEXT_PUBLIC_API_URL || "Not set")
    setAppUrl(process.env.NEXT_PUBLIC_APP_URL || "Not set")
    setImagePath(process.env.NEXT_PUBLIC_IMAGE_PATH || "Not set")
  }, [])

  const testEndpoint = async (endpoint: string, name: string) => {
    setLoading(true)
    try {
      const fullUrl = `${apiUrl}/${endpoint}`
      console.log(`Testing endpoint: ${fullUrl}`)

      const response = await fetch(fullUrl)
      let message = ""

      if (response.ok) {
        const data = await response.json()
        message = `Success! Received data: ${JSON.stringify(data).substring(0, 100)}...`
        setTestResults((prev) => [...prev, { endpoint: name, status: "success", message }])
      } else {
        const text = await response.text()
        message = `Failed with status ${response.status}: ${text}`
        setTestResults((prev) => [...prev, { endpoint: name, status: "error", message }])
      }
    } catch (error) {
      const message = `Error: ${error instanceof Error ? error.message : String(error)}`
      setTestResults((prev) => [...prev, { endpoint: name, status: "error", message }])
    } finally {
      setLoading(false)
    }
  }

  const runAllTests = async () => {
    setTestResults([])
    await testEndpoint("get_products.php", "Products API")
    await testEndpoint("get_categories.php", "Categories API")
    await testEndpoint("check_auth.php", "Auth API")
  }

  return (
    <Container>
      <h1 className="text-3xl font-bold mb-6">API Debug Page</h1>

      <div className="mb-8 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="font-medium">NEXT_PUBLIC_API_URL:</p>
            <p className="text-gray-700 break-all">{apiUrl}</p>
          </div>
          <div>
            <p className="font-medium">NEXT_PUBLIC_APP_URL:</p>
            <p className="text-gray-700 break-all">{appUrl}</p>
          </div>
          <div>
            <p className="font-medium">NEXT_PUBLIC_IMAGE_PATH:</p>
            <p className="text-gray-700 break-all">{imagePath}</p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <button
          onClick={runAllTests}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
        >
          {loading ? "Testing..." : "Test All Endpoints"}
        </button>
      </div>

      {testResults.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Test Results</h2>
          {testResults.map((result, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg ${result.status === "success" ? "bg-green-100" : "bg-red-100"}`}
            >
              <p className="font-medium">{result.endpoint}</p>
              <p className={result.status === "success" ? "text-green-700" : "text-red-700"}>{result.message}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Troubleshooting Tips</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Make sure your PHP backend is running and accessible</li>
          <li>Check that CORS is properly configured in your PHP backend</li>
          <li>Verify that your database connection is working</li>
          <li>Check the browser console for any errors</li>
          <li>Make sure your environment variables are set correctly</li>
          <li>Try accessing the PHP endpoints directly in your browser</li>
        </ul>
      </div>
    </Container>
  )
}
