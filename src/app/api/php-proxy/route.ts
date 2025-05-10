import { type NextRequest, NextResponse } from "next/server"

// This route proxies requests to the PHP backend
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const path = searchParams.get("path")

  if (!path) {
    return NextResponse.json({ error: "No path provided" }, { status: 400 })
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost/your-php-folder"
  const url = `${apiUrl}/${path}`

  try {
    const response = await fetch(url, {
      headers: {
        Cookie: request.headers.get("cookie") || "",
      },
    })

    if (!response.ok) {
      throw new Error(`PHP API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("PHP proxy error:", error)
    return NextResponse.json({ error: "Failed to fetch data from PHP backend" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const path = searchParams.get("path")

  if (!path) {
    return NextResponse.json({ error: "No path provided" }, { status: 400 })
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost/your-php-folder"
  const url = `${apiUrl}/${path}`

  try {
    const body = await request.json()

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: request.headers.get("cookie") || "",
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error(`PHP API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("PHP proxy error:", error)
    return NextResponse.json({ error: "Failed to post data to PHP backend" }, { status: 500 })
  }
}
