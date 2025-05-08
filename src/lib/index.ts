// Data fetching utility for client components
export async function getData(endpoint: string) {
  try {
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
    // Use relative URL for API routes in the same Next.js app
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/products`)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
    const data = await response.json()
    return { data }
  } catch (error) {
    console.error("Error fetching products:", error)
    return { data: [] }
  }
}

// Server-side function to get a single product
export async function getProduct(id: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/products/${id}`)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error)
    return null
  }
}

// Server-side function to get categories
export async function getCategories() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/categories`)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}

// Server-side function to get products by category
export async function getProductsByCategory(categoryId: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/categories/${categoryId}`)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error(`Error fetching products for category ${categoryId}:`, error)
    return []
  }
}

// Server-side function to get highlights
export async function getHighlights() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/highlights`)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching highlights:", error)
    return []
  }
}

// Server-side function to get blogs
export async function getBlogs() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/blogs`)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching blogs:", error)
    return []
  }
}
