import { NextResponse } from "next/server"
import { login } from "@/lib/auth"


export type User = {
    id: string
    name: string
    email: string
    role: "admin" | "user"
  }

export async function POST(request: Request) {
  const { email, password } = await request.json()

  const adminEmail = process.env.ADMIN_EMAIL
  const adminPassword = process.env.ADMIN_PASSWORD

  if (email === adminEmail && password === adminPassword) {
    const user: User = { id: "1", name: "Admin", email, role: "admin" }
    await login(user)
    return NextResponse.json({ user })
  }

  return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
}

