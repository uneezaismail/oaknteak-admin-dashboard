// "use client"

// import React from "react"
// import { useForm } from "react-hook-form"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { z } from "zod"
// import { useRouter } from "next/navigation"
// import { useAuth } from "../context/AuthContext"

// const loginSchema = z.object({
//   email: z.string().email("Invalid email address"),
//   password: z.string().min(6, "Password must be at least 6 characters"),
// })

// type LoginFormData = z.infer<typeof loginSchema>

// const LoginForm: React.FC = () => {
//   const { login } = useAuth()
//   const router = useRouter()
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     setError,
//   } = useForm<LoginFormData>({
//     resolver: zodResolver(loginSchema),
//   })

//   const onSubmit = async (data: LoginFormData) => {
//     const success = await login(data.email, data.password)
//     if (success) {
//       router.push("/dashboard")
//     } else {
//       setError("root", {
//         type: "manual",
//         message: "Invalid email or password",
//       })
//     }
//   }

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-md mx-auto  bg-emerald-700 p-8 rounded-xl shadow-lg">
//       <div>
//         <label htmlFor="email" className="block text-lg font-bold text-white mb-2">
//           Email
//         </label>
//         <input
//           {...register("email")}
//           type="email"
//           id="email"
//           className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-20 border border-white border-opacity-30 focus:border-yellow-300 focus:ring-2 focus:ring-yellow-300 text-white placeholder-white placeholder-opacity-70 transition duration-200"
//           placeholder="your@email.com"
//         />
//         {errors.email && <p className="mt-2 text-sm text-yellow-200 font-medium">{errors.email.message}</p>}
//       </div>
//       <div>
//         <label htmlFor="password" className="block text-lg font-bold text-white mb-2">
//           Password
//         </label>
//         <input
//           {...register("password")}
//           type="password"
//           id="password"
//           className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-20 border border-white border-opacity-30 focus:border-yellow-300 focus:ring-2 focus:ring-yellow-300 text-white placeholder-white placeholder-opacity-70 transition duration-200"
//           placeholder="••••••••"
//         />
//         {errors.password && <p className="mt-2 text-sm text-yellow-200 font-medium">{errors.password.message}</p>}
//       </div>
//       {errors.root && <p className="text-sm text-yellow-200 font-medium">{errors.root.message}</p>}
//       <button
//         type="submit"
//         className="w-full py-3 px-4 bg-white text-custom-green  font-bold rounded-lg shadow-md hover:shadow-lg transition hover:scale-105 duration-300 ease-in-out transform hover:-translate-y-1 hov5er:scale-10 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
//       >
//         Sign In
//       </button>
//     </form>
//   )
// }

// export default LoginForm













'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

type FormData = z.infer<typeof schema>

export default function LoginForm() {
  const [error, setError] = useState('')
  const router = useRouter()
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (response.ok) {
      router.push('/dashboard')
    } else {
      setError('Invalid email or password')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="border space-y-6 max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg">
      <div>
        <label htmlFor="email" className="block text-lg font-bold text-custom-green mb-2">
          Email
        </label>
        <input
          {...register('email')}
          type="email"
          id="email"
          className="w-full px-4 py-3 rounded-lg bg-gray-100 bg-opacity-20   border border-custom-green border-opacity-30  focus:ring-2  text-black placeholder-gray-500 placeholder-opacity-70 transition duration-200"
          placeholder="your@email.com"
        />
        {errors.email && <p className="mt-2 text-sm text-red-600 font-medium">{errors.email.message}</p>}
      </div>
      <div>
        <label htmlFor="password" className="block text-lg font-bold text-custom-green mb-2">
          Password
        </label>
        <input
          {...register('password')}
          type="password"
          id="password"
          className="w-full px-4 py-3 rounded-lg bg-gray-100 bg-opacity-20 border border-custom-green border-opacity-30 focus:ring-2  text-black placeholder-gray-500 placeholder-opacity-70 transition duration-200"
          placeholder="••••••••"
        />
        {errors.password && <p className="mt-2 text-sm text-red-600 font-medium">{errors.password.message}</p>}
      </div>
      {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
      <button
        type="submit"
        className="w-full py-3 px-4 bg-custom-green text-white font-bold rounded-lg shadow-md hover:shadow-lg transition hover:scale-105 duration-300 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-2  focus:ring-opacity-50"
      >
        Sign In
      </button>
    </form>
  )
}
