import { cookies } from "next/headers"
import { SignJWT, jwtVerify } from "jose"



export type User = {
    id: string
    name: string
    email: string
    role: "admin" | "user"
  }

const secretKey = process.env.JWT_SECRET_KEY!
const key = new TextEncoder().encode(secretKey)

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(key)
}

export async function decrypt(token: string): Promise<any> {
  const { payload } = await jwtVerify(token, key, {
    algorithms: ["HS256"],
  })
  return payload
}

export async function login(user: User): Promise<void> {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
  const session = await encrypt({ user, expires })

  if (session) {
    ;(await cookies()).set("session", session, {
      expires,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    })
  }
}

export async function logout(): Promise<void> {
  ;(await cookies()).delete("session")
}

export async function getSession(): Promise<User | null> {
  const session = (await cookies()).get("session")?.value
  if (!session) return null

  try {
    const parsed = await decrypt(session)
    if (!parsed || parsed.expires < Date.now()) {
      return null
    }
    return parsed.user
  } catch (error) {
    console.error("Error decrypting session:", error)
    return null
  }
}

