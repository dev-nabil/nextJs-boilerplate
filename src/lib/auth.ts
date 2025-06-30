import { cookies } from "next/headers"
import { SignJWT, jwtVerify } from "jose"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key-change-this-in-production")

export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "user"
}

export async function createToken(user: User): Promise<string> {
  return await new SignJWT({ ...user })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET)
}

export async function verifyToken(token: string): Promise<User | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as User
  } catch (error) {
    console.error("Token verification failed:", error)
    return null
  }
}

export async function getUser(): Promise<User | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth-token")?.value

  if (!token) return null

  return await verifyToken(token)
}

export async function setAuthCookie(user: User) {
  const token = await createToken(user)
  const cookieStore = await cookies()

  cookieStore.set("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}

export async function removeAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete("auth-token")
}
