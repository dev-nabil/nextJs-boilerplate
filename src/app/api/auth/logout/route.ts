import { NextResponse } from "next/server"
import { removeAuthCookie } from "@/lib/auth"

export async function POST() {
  try {
    await removeAuthCookie()

    return NextResponse.json({ message: "Logged out successfully" })
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
