// "use client"

// import React, { createContext, useContext, useState, useEffect } from "react"
// import Cookies from "js-cookie"
// import { useRouter } from "next/navigation"

// interface AuthContextType {
//   isAuthenticated: boolean
//   login: (email: string, password: string) => Promise<boolean>
//   logout: () => void
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined)

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
//   const router = useRouter()

//   useEffect(() => {
//     const token = Cookies.get("auth_token")
//     console.log("Checking auth_token:", token) // Debugging log
//     setIsAuthenticated(!!token)
//   }, [])

//   const login = async (email: string, password: string) => {
//     if (email === "admin@example.com" && password === "adminpassword") {
//       Cookies.set("auth_token", "dummy_token", { expires: 7 }) // Store token for 7 days
//       setIsAuthenticated(true)
//       return true
//     }
//     return false
//   }

//   const logout = () => {
//     Cookies.remove("auth_token")
//     setIsAuthenticated(false)
//     router.push("/")
//   }

//   return (
//     <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   )
// }

// export const useAuth = () => {
//   const context = useContext(AuthContext)
//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AuthProvider")
//   }
//   return context
// }














// "use client"

// import React, { createContext, useContext, useState, useEffect } from "react"
// import Cookies from "js-cookie"
// import { useRouter } from "next/navigation"

// interface AuthContextType {
//   isAuthenticated: boolean
//   login: (email: string, password: string) => Promise<boolean>
//   logout: () => void
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined)

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
//   const router = useRouter()

//   useEffect(() => {
//     const checkAuthStatus = () => {
//       const token = Cookies.get("auth_token")
//       setIsAuthenticated(!!token)
//     }

//     checkAuthStatus()
//     // Add event listener for storage changes
//     window.addEventListener("storage", checkAuthStatus)

//     return () => {
//       window.removeEventListener("storage", checkAuthStatus)
//     }
//   }, [])

//   const login = async (email: string, password: string) => {
//     if (email === "admin@example.com" && password === "adminpassword") {
//       Cookies.set("auth_token", "dummy_token", { expires: 7 }) // Store token for 7 days
//       setIsAuthenticated(true)
//       return true
//     }
//     return false
//   }

//   const logout = () => {
//     Cookies.remove("auth_token")
//     setIsAuthenticated(false)
//     router.push("/")
//   }

//   return (
//     <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   )
// }

// export const useAuth = () => {
//   const context = useContext(AuthContext)
//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AuthProvider")
//   }
//   return context
// }









"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import Cookies from "js-cookie"
import { useRouter } from "next/navigation"

interface AuthContextType {
  isAuthenticated: boolean
  isAdmin: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [isAdmin, setIsAdmin] = useState<boolean>(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuthStatus = () => {
      const token = Cookies.get("auth_token")
      const userRole = Cookies.get("user_role")
      setIsAuthenticated(!!token)
      setIsAdmin(userRole === "admin")
    }

    checkAuthStatus()
    window.addEventListener("storage", checkAuthStatus)

    return () => {
      window.removeEventListener("storage", checkAuthStatus)
    }
  }, [])

  const adminEmail = process.env.ADMIN_EMAIL 
  const adminPassword = process.env.ADMIN_PASSWORD 

  const login = async (email: string, password: string) => {
    if (email === adminEmail  && password === adminPassword) {
      Cookies.set("auth_token", "dummy_token", { expires: 7 })
      Cookies.set("user_role", "admin", { expires: 7 })
      setIsAuthenticated(true)
      setIsAdmin(true)
      return true
    } else if (email === adminEmail  && password === adminPassword) {
      Cookies.set("auth_token", "dummy_token", { expires: 7 })
      Cookies.set("user_role", "user", { expires: 7 })
      setIsAuthenticated(true)
      setIsAdmin(false)
      return true
    }
    return false
  }

  const logout = () => {
    Cookies.remove("auth_token")
    Cookies.remove("user_role")
    setIsAuthenticated(false)
    setIsAdmin(false)
    router.push("/")
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}