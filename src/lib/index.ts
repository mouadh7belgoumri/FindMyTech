// Data fetching utility for client components
export async function getData(endpoint: string) {
  try {
    console.log(`Fetching data from: ${endpoint}`)
    const response = await fetch(endpoint)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching data:", error)
    throw error
  }
}

// Server-side data fetching function for Next.js
export async function getProducts() {
  try {
    // First try to use the local API route which serves mock data
    // This is more reliable for server-side rendering
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    try {
      const response = await fetch(`${appUrl}/api/products`, {
        next: { revalidate: 60 }, // Cache for 60 seconds
      })

      if (response.ok) {
        const data = await response.json()
        return { data: data }
      }
    } catch (error) {
      console.warn("Error fetching from local API, trying PHP backend:", error)
    }

    // If local API fails, try the PHP backend
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    if (!apiUrl) {
      throw new Error("NEXT_PUBLIC_API_URL is not defined")
    }

    // Use node-fetch compatible options
    const response = await fetch(`${apiUrl}/get_products.php`, {
      next: { revalidate: 60 }, // Cache for 60 seconds
      headers: {
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`HTTP error! Status: ${response.status}, Response: ${errorText}`)
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data = await response.json()
    console.log("Products fetched successfully:", data)
    return data
  } catch (error) {
    console.error("Error fetching products:", error)
    // Return mock data as fallback
    return { data: [] }
  }
}

// Server-side function to get a single product
export async function getProduct(id: string) {
  try {
    // First try to use the local API route
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    try {
      const response = await fetch(`${appUrl}/api/products/${id}`, {
        next: { revalidate: 60 }, // Cache for 60 seconds
      })

      if (response.ok) {
        return await response.json()
      }
    } catch (error) {
      console.warn(`Error fetching product ${id} from local API, trying PHP backend:`, error)
    }

    // If local API fails, try the PHP backend
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    if (!apiUrl) {
      throw new Error("NEXT_PUBLIC_API_URL is not defined")
    }

    const response = await fetch(`${apiUrl}/get_product.php?id=${id}`, {
      next: { revalidate: 60 }, // Cache for 60 seconds
      headers: {
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`HTTP error! Status: ${response.status}, Response: ${errorText}`)
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error)
    // Find the product in the mock data
    const { products } = await import("./constants")
    return products.find((p) => p._id === id) || null
  }
}

// Server-side function to get categories
export async function getCategories() {
  try {
    // First try to use the local API route
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    try {
      const response = await fetch(`${appUrl}/api/categories`, {
        next: { revalidate: 60 }, // Cache for 60 seconds
      })

      if (response.ok) {
        return await response.json()
      }
    } catch (error) {
      console.warn("Error fetching categories from local API, trying PHP backend:", error)
    }

    // If local API fails, try the PHP backend
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    if (!apiUrl) {
      throw new Error("NEXT_PUBLIC_API_URL is not defined")
    }

    const response = await fetch(`${apiUrl}/get_categories.php`, {
      next: { revalidate: 60 }, // Cache for 60 seconds
      headers: {
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`HTTP error! Status: ${response.status}, Response: ${errorText}`)
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching categories:", error)
    // Return mock data as fallback
    const { categories } = await import("./constants")
    return categories
  }
}

// Server-side function to get products by category
export async function getProductsByCategory(categoryId: string) {
  try {
    // First try to use the local API route
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    try {
      const response = await fetch(`${appUrl}/api/categories/${categoryId}`, {
        next: { revalidate: 60 }, // Cache for 60 seconds
      })

      if (response.ok) {
        return await response.json()
      }
    } catch (error) {
      console.warn(`Error fetching products for category ${categoryId} from local API, trying PHP backend:`, error)
    }

    // If local API fails, try the PHP backend
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    if (!apiUrl) {
      throw new Error("NEXT_PUBLIC_API_URL is not defined")
    }

    const response = await fetch(`${apiUrl}/get_products.php?category=${categoryId}`, {
      next: { revalidate: 60 }, // Cache for 60 seconds
      headers: {
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`HTTP error! Status: ${response.status}, Response: ${errorText}`)
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error(`Error fetching products for category ${categoryId}:`, error)
    // Filter mock data as fallback
    const { products } = await import("./constants")
    return products.filter((p) => p._base === categoryId)
  }
}

// Server-side function to get highlights
export async function getHighlights() {
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const response = await fetch(`${appUrl}/api/highlights`, {
      next: { revalidate: 60 }, // Cache for 60 seconds
    })

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching highlights:", error)
    // Return mock data as fallback
    const { highlightsProducts } = await import("./constants")
    return highlightsProducts
  }
}

// Server-side function to get blogs
export async function getBlogs() {
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const response = await fetch(`${appUrl}/api/blogs`, {
      next: { revalidate: 60 }, // Cache for 60 seconds
    })

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching blogs:", error)
    // Return mock data as fallback
    const { blogsData } = await import("./constants")
    return blogsData
  }
}
