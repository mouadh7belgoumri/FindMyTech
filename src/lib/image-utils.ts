/**
 * Resolves an image path to a full URL
 * @param imagePath The image path from the database
 * @returns The full URL to the image
 */
export function resolveImagePath(imagePath: string): string {
  // If the image path is already a full URL, return it
  if (imagePath.startsWith("http")) {
    return imagePath
  }

  // If the image path starts with a slash, remove it
  const cleanPath = imagePath.startsWith("/") ? imagePath.slice(1) : imagePath

  // Get the API URL from environment variables
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost/your-php-folder"

  // Return the full URL
  return `${apiUrl}/${cleanPath}`
}

/**
 * Checks if an image exists
 * @param url The URL to check
 * @returns A promise that resolves to true if the image exists, false otherwise
 */
export async function imageExists(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: "HEAD" })
    return response.ok
  } catch (error) {
    return false
  }
}
