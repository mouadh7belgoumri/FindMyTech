"use client"

import { useState } from "react"
import { fetchFromAPI, postJSONToAPI } from "@/lib/api"
import Container from "@/components/ui/Container"

export default function TestIntegrationPage() {
  const [authStatus, setAuthStatus] = useState<{ status: string; message: string }>({
    status: "idle",
    message: "",
  })
  const [productsStatus, setProductsStatus] = useState<{ status: string; message: string }>({
    status: "idle",
    message: "",
  })
  const [cartStatus, setCartStatus] = useState<{ status: string; message: string }>({
    status: "idle",
    message: "",
  })
  const [imageStatus, setImageStatus] = useState<{ status: string; message: string }>({
    status: "idle",
    message: "",
  })

  const testAuth = async () => {
    setAuthStatus({ status: "loading", message: "Testing authentication..." })
    try {
      const data = await fetchFromAPI("check_auth.php")
      setAuthStatus({
        status: "success",
        message: `Authentication check successful! Status: ${data.authenticated ? "Authenticated" : "Not authenticated"}`,
      })
    } catch (error) {
      console.error("Auth test error:", error)
      setAuthStatus({
        status: "error",
        message: `Authentication check failed: ${error instanceof Error ? error.message : String(error)}`,
      })
    }
  }

  const testProducts = async () => {
    setProductsStatus({ status: "loading", message: "Fetching products..." })
    try {
      const data = await fetchFromAPI("get_products.php")
      setProductsStatus({
        status: "success",
        message: `Products fetched successfully! Count: ${data.length || 0}`,
      })
    } catch (error) {
      console.error("Products test error:", error)
      setProductsStatus({
        status: "error",
        message: `Products fetch failed: ${error instanceof Error ? error.message : String(error)}`,
      })
    }
  }

  const testCart = async () => {
    setCartStatus({ status: "loading", message: "Testing cart functionality..." })
    try {
      // First, try to get the current cart
      const cartData = await fetchFromAPI("cart.php")

      // Then, try to add a test product (this will only work if you have a product with ID 1)
      const formData = new FormData()
      formData.append("product_id", "1")
      formData.append("quantity", "1")

      const addResponse = await postJSONToAPI("add_to_cart.php", { product_id: 1, quantity: 1 })

      setCartStatus({
        status: "success",
        message: `Cart functionality working! Current items: ${cartData.cart_items?.length || 0}`,
      })
    } catch (error) {
      console.error("Cart test error:", error)
      setCartStatus({
        status: "error",
        message: `Cart test failed: ${error instanceof Error ? error.message : String(error)}`,
      })
    }
  }

  const testImages = async () => {
    setImageStatus({ status: "loading", message: "Testing image paths..." })
    try {
      // Try to fetch a product with an image
      const data = await fetchFromAPI("get_products.php")

      if (data.length > 0 && data[0].image) {
        const imagePath = data[0].image
        const fullImageUrl = imagePath.startsWith("http")
          ? imagePath
          : `${process.env.NEXT_PUBLIC_API_URL}/${imagePath.startsWith("/") ? imagePath.slice(1) : imagePath}`

        // Try to fetch the image
        const imageResponse = await fetch(fullImageUrl, { method: "HEAD" })

        if (imageResponse.ok) {
          setImageStatus({
            status: "success",
            message: `Image path working! Sample image: ${fullImageUrl}`,
          })
        } else {
          setImageStatus({
            status: "error",
            message: `Image exists but cannot be loaded: ${fullImageUrl}`,
          })
        }
      } else {
        setImageStatus({
          status: "warning",
          message: "No products with images found to test",
        })
      }
    } catch (error) {
      console.error("Image test error:", error)
      setImageStatus({
        status: "error",
        message: `Image test failed: ${error instanceof Error ? error.message : String(error)}`,
      })
    }
  }

  return (
    <Container>
      <h1 className="text-3xl font-bold mb-6">Integration Test Page</h1>
      <p className="mb-6">Use this page to test the integration between your Next.js frontend and PHP backend.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Authentication Test */}
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Authentication Test</h2>
          <p className="mb-4">Tests the connection to your authentication system.</p>
          <div className="mb-4">
            <button
              onClick={testAuth}
              disabled={authStatus.status === "loading"}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
            >
              {authStatus.status === "loading" ? "Testing..." : "Test Authentication"}
            </button>
          </div>
          {authStatus.status !== "idle" && (
            <div
              className={`p-3 rounded ${
                authStatus.status === "loading"
                  ? "bg-gray-100"
                  : authStatus.status === "success"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
              }`}
            >
              {authStatus.message}
            </div>
          )}
        </div>

        {/* Products Test */}
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Products Test</h2>
          <p className="mb-4">Tests fetching products from your PHP backend.</p>
          <div className="mb-4">
            <button
              onClick={testProducts}
              disabled={productsStatus.status === "loading"}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
            >
              {productsStatus.status === "loading" ? "Testing..." : "Test Products"}
            </button>
          </div>
          {productsStatus.status !== "idle" && (
            <div
              className={`p-3 rounded ${
                productsStatus.status === "loading"
                  ? "bg-gray-100"
                  : productsStatus.status === "success"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
              }`}
            >
              {productsStatus.message}
            </div>
          )}
        </div>

        {/* Cart Test */}
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Cart Test</h2>
          <p className="mb-4">Tests adding products to your cart.</p>
          <div className="mb-4">
            <button
              onClick={testCart}
              disabled={cartStatus.status === "loading"}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
            >
              {cartStatus.status === "loading" ? "Testing..." : "Test Cart"}
            </button>
          </div>
          {cartStatus.status !== "idle" && (
            <div
              className={`p-3 rounded ${
                cartStatus.status === "loading"
                  ? "bg-gray-100"
                  : cartStatus.status === "success"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
              }`}
            >
              {cartStatus.message}
            </div>
          )}
        </div>

        {/* Image Test */}
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Image Test</h2>
          <p className="mb-4">Tests loading images from your PHP backend.</p>
          <div className="mb-4">
            <button
              onClick={testImages}
              disabled={imageStatus.status === "loading"}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
            >
              {imageStatus.status === "loading" ? "Testing..." : "Test Images"}
            </button>
          </div>
          {imageStatus.status !== "idle" && (
            <div
              className={`p-3 rounded ${
                imageStatus.status === "loading"
                  ? "bg-gray-100"
                  : imageStatus.status === "success"
                    ? "bg-green-100 text-green-800"
                    : imageStatus.status === "warning"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
              }`}
            >
              {imageStatus.message}
            </div>
          )}
        </div>
      </div>

      <div className="bg-gray-100 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Troubleshooting Tips</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Make sure your PHP backend is running and accessible</li>
          <li>Check that your environment variables are set correctly</li>
          <li>Verify that CORS is properly configured on your PHP backend</li>
          <li>Check the browser console for any errors</li>
          <li>Make sure your database connection is working</li>
        </ul>
      </div>
    </Container>
  )
}
