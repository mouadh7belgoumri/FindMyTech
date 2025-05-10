import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { first_name, second_name, email, password, confirm_password } = body

    // Validate input
    if (!first_name || !second_name || !email || !password || !confirm_password) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required",
        },
        { status: 400 },
      )
    }

    if (!email.includes("@")) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email address",
        },
        { status: 400 },
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          message: "Password must be at least 8 characters",
        },
        { status: 400 },
      )
    }

    if (password !== confirm_password) {
      return NextResponse.json(
        {
          success: false,
          message: "Passwords do not match",
        },
        { status: 400 },
      )
    }

    // In a real app, you would save the user to a database
    // For this mock, we'll just return success
    return NextResponse.json({
      success: true,
      message: "Registration successful!",
      user_id: "new_user_id",
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred during registration",
      },
      { status: 500 },
    )
  }
}
