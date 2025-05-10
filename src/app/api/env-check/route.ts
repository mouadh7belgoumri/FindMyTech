import { NextResponse } from "next/server"

export async function GET() {
  // Return a safe subset of environment variables
  return NextResponse.json({
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "Not set",
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "Not set",
    NEXT_PUBLIC_IMAGE_PATH: process.env.NEXT_PUBLIC_IMAGE_PATH || "Not set",
    NODE_ENV: process.env.NODE_ENV || "Not set",
  })
}
