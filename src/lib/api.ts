// API utility functions for communicating with PHP backend

// Base API URL from environment variable
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost/your-php-folder"

/**
 * Fetch data from the PHP backend
 */
export async function fetchFromAPI(endpoint: string, options: RequestInit = {}) {
  try {
    const url = `${API_URL}/${endpoint}`
    console.log(`Fetching from: ${url}`)

    // Add timeout to prevent hanging requests
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

    const response = await fetch(url, {
      ...options,
      credentials: "include", // Include cookies for session management
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      signal: controller.signal,
      cache: "no-store", // Prevent caching issues
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`API error (${response.status}): ${errorText}`)
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }

    // Try to parse as JSON, but handle text responses too
    const contentType = response.headers.get("content-type")
    if (contentType && contentType.includes("application/json")) {
      return await response.json()
    } else {
      return { text: await response.text() }
    }
  } catch (error) {
    console.error("API fetch error:", error)
    // Return a structured error object instead of throwing
    return {
      error: true,
      message: error instanceof Error ? error.message : String(error),
      data: null,
    }
  }
}

/**
 * Post form data to the PHP backend
 */
export async function postFormToAPI(endpoint: string, formData: FormData) {
  try {
    const url = `${API_URL}/${endpoint}`
    console.log(`Posting form to: ${url}`)

    const response = await fetch(url, {
      method: "POST",
      credentials: "include", // Include cookies for session management
      body: formData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`API error (${response.status}): ${errorText}`)
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("API form post error:", error)
    throw error
  }
}

/**
 * Post JSON data to the PHP backend
 */
export async function postJSONToAPI(endpoint: string, data: any) {
  try {
    const url = `${API_URL}/${endpoint}`
    console.log(`Posting JSON to: ${url}`, data)

    const response = await fetch(url, {
      method: "POST",
      credentials: "include", // Include cookies for session management
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`API error (${response.status}): ${errorText}`)
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }

    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.error("API JSON post error:", error)
    throw error
  }
}

/**
 * Check if user is authenticated
 */
export async function checkAuth() {
  try {
    const data = await fetchFromAPI("check_auth.php")
    return data.authenticated || false
  } catch (error) {
    console.error("Auth check error:", error)
    return false
  }
}

/**
 * Get user data if authenticated
 */
export async function getUserData() {
  try {
    const data = await fetchFromAPI("get_user.php")
    return data.user || null
  } catch (error) {
    console.error("Get user data error:", error)
    return null
  }
}
