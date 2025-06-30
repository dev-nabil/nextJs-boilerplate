import { type NextRequest, NextResponse } from "next/server"
import { setAuthCookie } from "@/lib/auth"

// Mock user data - replace with your database
const mockUsers = [
  {
    id: "1",
    email: "admin@example.com",
    password: "password123",
    name: "Admin User",
    role: "admin" as const,
  },
  {
    id: "2",
    email: "user@example.com",
    password: "password123",
    name: "Regular User",
    role: "user" as const,
  },
]

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Find user - replace with database query
    const user = mockUsers.find((u) => u.email === email && u.password === password)

    if (!user) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
    }

    // Create response
    const response = NextResponse.json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })

    // Set auth cookie
    await setAuthCookie({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    })

    return response
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
