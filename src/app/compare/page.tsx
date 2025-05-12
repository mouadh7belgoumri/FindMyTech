"use client"

import { useState } from "react"
import { FaPlusCircle } from "react-icons/fa"
import axios from "axios"
import { useQuery, QueryClient, QueryClientProvider } from "@tanstack/react-query"

// Define types
interface Product {
  id: number
  name: string
  [key: string]: any // For other fields that might be in the product
}

// Create a client
const queryClient = new QueryClient()

// Wrap the page component with QueryClientProvider
function ComparePageContent() {
  const [selectedProducts, setSelectedProducts] = useState<{left: number | null, right: number | null}>({
    left: null,
    right: null
  })
  const [dropdownOpen, setDropdownOpen] = useState<{left: boolean, right: boolean}>({
    left: false,
    right: false
  })

  const { data: products, isLoading: productsLoading } = useProducts()
  const { data: comparisonResult, isLoading: comparisonLoading, refetch: compareProducts } = useCompareProducts(
    selectedProducts.left, 
    selectedProducts.right
  )

  const handleSelectProduct = (side: 'left' | 'right', productId: number) => {
    setSelectedProducts(prev => ({
      ...prev,
      [side]: productId
    }))
    setDropdownOpen(prev => ({
      ...prev,
      [side]: false
    }))

    // If both products are selected, trigger comparison
    if (side === 'left' && selectedProducts.right !== null) {
      compareProducts()
    } else if (side === 'right' && selectedProducts.left !== null) {
      compareProducts()
    }
  }

  const toggleDropdown = (side: 'left' | 'right') => {
    setDropdownOpen(prev => ({
      ...prev,
      [side]: !prev[side]
    }))
  }

  const getSelectedProductName = (side: 'left' | 'right') => {
    const productId = selectedProducts[side]
    if (productId === null || !products) return null
    return products.find((product: Product) => product.id === productId)?.name
  }

  return (
    <div className="flex justify-center bg-[#212026] items-center min-h-screen py-10">
      <div className="flex flex-col justify-start w-4/5 max-w-6xl gap-10">
        <h1 className="text-3xl font-bold text-white text-center mb-6">Compare Products</h1>
        
        <div className="flex justify-around items-start gap-8">
          {/* Left Product Selection */}
          <div className="w-64 relative">
            <button 
              onClick={() => toggleDropdown('left')}
              className="w-full h-80 border-2 border-gray-300 rounded-lg flex flex-col justify-center items-center bg-white bg-opacity-50 shadow-md cursor-pointer hover:bg-gray-200"
            >
              {getSelectedProductName('left') ? (
                <div className="text-center p-4">
                  <h3 className="font-medium text-lg">{getSelectedProductName('left')}</h3>
                </div>
              ) : (
                <FaPlusCircle className="text-gray-500 text-4xl cursor-pointer hover:text-gray-700" />
              )}
            </button>
            
            {dropdownOpen.left && products && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white shadow-lg rounded-lg max-h-80 overflow-y-auto z-10">
                {productsLoading ? (
                  <div className="p-4 text-center">Loading products...</div>
                ) : (
                  <ul>
                    {products.map((product: Product) => (
                      <li 
                        key={product.id} 
                        className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleSelectProduct('left', product.id)}
                      >
                        {product.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
          
          {/* Right Product Selection */}
          <div className="w-64 relative">
            <button 
              onClick={() => toggleDropdown('right')}
              className="w-full h-80 border-2 border-gray-300 rounded-lg flex flex-col justify-center items-center bg-white bg-opacity-50 shadow-md cursor-pointer hover:bg-gray-200"
            >
              {getSelectedProductName('right') ? (
                <div className="text-center p-4">
                  <h3 className="font-medium text-lg">{getSelectedProductName('right')}</h3>
                </div>
              ) : (
                <FaPlusCircle className="text-gray-500 text-4xl cursor-pointer hover:text-gray-700" />
              )}
            </button>
            
            {dropdownOpen.right && products && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white shadow-lg rounded-lg max-h-80 overflow-y-auto z-10">
                {productsLoading ? (
                  <div className="p-4 text-center">Loading products...</div>
                ) : (
                  <ul>
                    {products.map((product: Product) => (
                      <li 
                        key={product.id} 
                        className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleSelectProduct('right', product.id)}
                      >
                        {product.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Comparison Results */}
        {selectedProducts.left && selectedProducts.right && (
          <div className="mt-10 w-full">
            <LLMResult 
              result={comparisonResult} 
              isLoading={comparisonLoading} 
              leftProductName={getSelectedProductName('left')}
              rightProductName={getSelectedProductName('right')}
            />
          </div>
        )}
      </div>
    </div>
  )
}

// Hook to fetch and cache products
function useProducts() {
  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await axios.get('http://localhost:8012/server/products.php')
      return response.data.products
    },
    staleTime: 5 * 60 * 1000, // Cache valid for 5 minutes
  })
}

// Hook to compare two products
function useCompareProducts(productId1: number | null, productId2: number | null) {
  return useQuery<string>({
    queryKey: ['compare', productId1, productId2],
    queryFn: async () => {
      if (!productId1 || !productId2) return null
      
      const response = await axios.get(`http://localhost:8012/compare`, {
        params: { product1: productId1, product2: productId2 }
      })
      return response.data
    },
    enabled: false, // Don't run automatically, only when refetch is called
  })
}

// Component to display comparison results
function LLMResult({ 
  result, 
  isLoading, 
  leftProductName, 
  rightProductName 
}: { 
  result: string | null, 
  isLoading: boolean, 
  leftProductName: string | null,
  rightProductName: string | null
}) {
  if (isLoading) {
    return (
      <div className="bg-white bg-opacity-80 p-6 rounded-lg shadow-lg">
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-lg">Comparing products...</span>
        </div>
      </div>
    )
  }

  if (!result) return null

  return (
    <div className="bg-white bg-opacity-80 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">
        {leftProductName} vs {rightProductName}
      </h2>
      <div className="prose max-w-none">
        {result}
      </div>
    </div>
  )
}

// Export the wrapped component
export default function ComparePage() {
  return (
    <QueryClientProvider client={queryClient}>
      <ComparePageContent />
    </QueryClientProvider>
  )
}