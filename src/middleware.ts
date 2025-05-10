import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Define which routes require authentication
const protectedRoutes = ["/profile", "/profile/edit", "/add-product", "/orders", "/checkout"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`))

  if (isProtectedRoute) {
    try {
      // Check if the user is authenticated
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost/your-php-folder"
      const response = await fetch(`${apiUrl}/check_auth.php`, {
        headers: {
          Cookie: request.headers.get("cookie") || "",
        },
        credentials: "include",
      })

      const data = await response.json()

      if (!data.authenticated) {
        // Redirect to login page if not authenticated
        return NextResponse.redirect(new URL("/Sign_in", request.url))
      }
    } catch (error) {
      console.error("Auth middleware error:", error)
      // Redirect to login page on error
      return NextResponse.redirect(new URL("/Sign_in", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/profile/:path*", "/add-product", "/orders", "/checkout"],
}
