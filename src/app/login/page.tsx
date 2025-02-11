"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { useUser } from "@/context/useContext"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { setUser } = useUser()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("") 
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        throw new Error("Invalid email or password")
      }

      const data = await response.json()
      setUser(data.user)
      router.push("/dashboard")
    } catch (error) {
      console.error("Login error:", error)
      setError("Invalid email or password")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="max-w-sm md:max-w-md bg-white p-4 md:p-8 rounded-xl shadow-lg border border-custom-green border-opacity-30">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-custom-green">Welcome Admin</CardTitle>
          <CardDescription className="text-gray-500">Enter your credentials to access the dashboard</CardDescription>
        </CardHeader>
        {error && (
          <div className="px-4 py-3 rounded-md bg-red-50 border border-red-200 text-red-800 mb-4" role="alert">
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-lg font-bold text-custom-green">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg bg-gray-100 bg-opacity-20 border border-custom-green border-opacity-30 focus:ring-2 text-black placeholder-gray-500 placeholder-opacity-70 transition duration-200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-lg font-bold text-custom-green">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg bg-gray-100 bg-opacity-20 border border-custom-green border-opacity-30 focus:ring-2 text-black placeholder-gray-500 placeholder-opacity-70 transition duration-200"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full py-4 px-4 bg-custom-green text-white font-bold rounded-lg shadow-md hover:shadow-lg transition hover:scale-105 duration-300 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-opacity-50"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
