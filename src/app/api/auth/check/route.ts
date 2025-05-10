import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost/your-php-folder"
  const url = `${apiUrl}/check_auth.php`

  try {
    const response = await fetch(url, {
      headers: {
        Cookie: request.headers.get("cookie") || "",
      },
      credentials: "include",
    })

    if (!response.ok) {
      throw new Error(`Auth check error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Auth check error:", error)
    return NextResponse.json({ authenticated: false }, { status: 200 })
  }
}
