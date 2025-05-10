import { blogsData } from "@/lib/constants"
import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json(blogsData)
}
