import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    // This is a mock authentication - in a real app, you would validate against a database
    if (email === "user@example.com" && password === "password123") {
      return NextResponse.json({
        success: true,
        user: {
          id: "1",
          firstName: "John",
          lastName: "Doe",
          email: "user@example.com",
          avatar: "/placeholder.svg?height=80&width=80",
        },
      })
    }

    return NextResponse.json(
      {
        success: false,
        message: "Invalid email or password",
      },
      { status: 401 },
    )
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred during login",
      },
      { status: 500 },
    )
  }
}
