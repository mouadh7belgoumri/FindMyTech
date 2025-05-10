"use client"

import { useState, useEffect } from "react"
import { FaPlusCircle } from "react-icons/fa"
import Container from "@/components/ui/Container"
import Image from "next/image"

interface Product {
  _id: string
  name: string
  description?: string
  image?: string
  regularPrice?: number
  discountedPrice?: number
  category?: string
  characteristics?: string
  brand?: string
}

export default function ComparePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProduct1, setSelectedProduct1] = useState<Product | null>(null)
  const [selectedProduct2, setSelectedProduct2] = useState<Product | null>(null)
  const [comparisonResult, setComparisonResult] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(false)
  const [fetchingProducts, setFetchingProducts] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchProducts = async () => {
      setFetchingProducts(true)
      setError("")

      try {
        // First try PHP backend
        const apiUrl = process.env.NEXT_PUBLIC_API_URL
        if (apiUrl) {
          try {
            const response = await fetch(`${apiUrl}/get_products.php`)
            if (response.ok) {
              const data = await response.json()
              setProducts(data.data || [])
              setFetchingProducts(false)
              return
            }
          } catch (error) {
            console.warn("PHP API fetch failed, falling back to local API:", error)
          }
        }

        // Fallback to local Next.js API route
        const response = await fetch("/api/products")
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        const data = await response.json()
        setProducts(data || [])
      } catch (error) {
        console.error("Error fetching products:", error)
        setError("Failed to load products. Please try again later.")
        // Set empty array to prevent UI from breaking
        setProducts([])
      } finally {
        setFetchingProducts(false)
      }
    }

    fetchProducts()
  }, [])

  const handleProductSelect = (product: Product, slot: number) => {
    if (slot === 1) {
      setSelectedProduct1(product)
    } else {
      setSelectedProduct2(product)
    }
  }

  const handleCompare = async () => {
    if (!selectedProduct1 || !selectedProduct2) {
      alert("Please select two products to compare")
      return
    }

    if (selectedProduct1._id === selectedProduct2._id) {
      alert("Please select two different products")
      return
    }

    setLoading(true)
    setError("")

    try {
      // First try PHP backend
      const apiUrl = process.env.NEXT_PUBLIC_API_URL
      if (apiUrl) {
        try {
          const formData = new FormData()
          formData.append("product1", selectedProduct1._id)
          formData.append("product2", selectedProduct2._id)

          const response = await fetch(`${apiUrl}/compare_products.php`, {
            method: "POST",
            body: formData,
          })

          if (response.ok) {
            const data = await response.json()
            if (data.success) {
              setComparisonResult(data.comparison || {})
              return
            }
          }
        } catch (error) {
          console.warn("PHP API comparison failed, using client-side comparison:", error)
        }
      }

      // Fallback to client-side comparison
      const comparison = compareProductsClientSide(selectedProduct1, selectedProduct2)
      setComparisonResult(comparison)
    } catch (error) {
      console.error("Error comparing products:", error)
      setError("An error occurred while comparing products. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Simple client-side comparison as fallback
  const compareProductsClientSide = (product1: Product, product2: Product) => {
    const result: Record<string, any> = {}

    // Compare basic properties
    result.name = { product1: product1.name, product2: product2.name }
    result.category = { product1: product1.category || "N/A", product2: product2.category || "N/A" }
    result.price = {
      product1: product1.discountedPrice || product1.regularPrice || 0,
      product2: product2.discountedPrice || product2.regularPrice || 0,
    }
    result.brand = { product1: product1.brand || "N/A", product2: product2.brand || "N/A" }

    // Compare characteristics if available
    if (product1.characteristics || product2.characteristics) {
      const chars1 = product1.characteristics?.split(",").map((c) => c.trim()) || []
      const chars2 = product2.characteristics?.split(",").map((c) => c.trim()) || []

      result.characteristics = {
        product1: chars1.join(", ") || "N/A",
        product2: chars2.join(", ") || "N/A",
      }
    }

    return result
  }

  return (
    <Container>
      <h1 className="text-3xl font-bold mb-6">Compare Products</h1>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      {fetchingProducts ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
          <p className="mt-2">Loading products...</p>
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row gap-8 mb-8">
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-4">Product 1</h2>
              {selectedProduct1 ? (
                <div className="border p-4 rounded-lg">
                  <div className="relative h-64 w-full mb-4">
                    <Image
                      src={selectedProduct1.image || "/placeholder.svg"}
                      alt={selectedProduct1.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <h3 className="text-lg font-medium">{selectedProduct1.name}</h3>
                  <p className="text-gray-600">{selectedProduct1.category}</p>
                  <p className="font-semibold mt-2">
                    ${selectedProduct1.discountedPrice || selectedProduct1.regularPrice}
                  </p>
                  <button onClick={() => setSelectedProduct1(null)} className="mt-4 text-red-600 hover:text-red-800">
                    Remove
                  </button>
                </div>
              ) : (
                <div className="border-2 border-gray-300 rounded-lg flex justify-center items-center bg-white bg-opacity-50 shadow-md cursor-pointer hover:bg-gray-200 h-80">
                  <div className="relative">
                    <FaPlusCircle className="text-gray-500 text-4xl cursor-pointer hover:text-gray-700" />
                    <select
                      className="absolute opacity-0 inset-0 w-full h-full cursor-pointer"
                      onChange={(e) => {
                        const productId = e.target.value
                        const product = products.find((p) => p._id === productId)
                        if (product) handleProductSelect(product, 1)
                      }}
                      value=""
                    >
                      <option value="">Select a product</option>
                      {products.map((product) => (
                        <option key={product._id} value={product._id}>
                          {product.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>

            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-4">Product 2</h2>
              {selectedProduct2 ? (
                <div className="border p-4 rounded-lg">
                  <div className="relative h-64 w-full mb-4">
                    <Image
                      src={selectedProduct2.image || "/placeholder.svg"}
                      alt={selectedProduct2.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <h3 className="text-lg font-medium">{selectedProduct2.name}</h3>
                  <p className="text-gray-600">{selectedProduct2.category}</p>
                  <p className="font-semibold mt-2">
                    ${selectedProduct2.discountedPrice || selectedProduct2.regularPrice}
                  </p>
                  <button onClick={() => setSelectedProduct2(null)} className="mt-4 text-red-600 hover:text-red-800">
                    Remove
                  </button>
                </div>
              ) : (
                <div className="border-2 border-gray-300 rounded-lg flex justify-center items-center bg-white bg-opacity-50 shadow-md cursor-pointer hover:bg-gray-200 h-80">
                  <div className="relative">
                    <FaPlusCircle className="text-gray-500 text-4xl cursor-pointer hover:text-gray-700" />
                    <select
                      className="absolute opacity-0 inset-0 w-full h-full cursor-pointer"
                      onChange={(e) => {
                        const productId = e.target.value
                        const product = products.find((p) => p._id === productId)
                        if (product) handleProductSelect(product, 2)
                      }}
                      value=""
                    >
                      <option value="">Select a product</option>
                      {products.map((product) => (
                        <option key={product._id} value={product._id}>
                          {product.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-center mb-8">
            <button
              onClick={handleCompare}
              disabled={!selectedProduct1 || !selectedProduct2 || loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? "Comparing..." : "Compare Products"}
            </button>
          </div>

          {Object.keys(comparisonResult).length > 0 && (
            <div className="bg-gray-100 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">Comparison Result</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Feature
                      </th>
                      <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        {selectedProduct1?.name || "Product 1"}
                      </th>
                      <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        {selectedProduct2?.name || "Product 2"}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(comparisonResult).map(([feature, values]: [string, any]) => (
                      <tr key={feature}>
                        <td className="py-2 px-4 border-b border-gray-200 capitalize font-medium">{feature}</td>
                        <td className="py-2 px-4 border-b border-gray-200">{values.product1}</td>
                        <td className="py-2 px-4 border-b border-gray-200">{values.product2}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </Container>
  )
}
