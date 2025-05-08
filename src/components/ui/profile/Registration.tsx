"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"

interface RegistrationFormData {
  firstName: string
  lastName: string
  email: string
  password: string
}

export default function Registration() {
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegistrationFormData>()

  const onSubmit = async (data: RegistrationFormData) => {
    setLoading(true)
    try {
      // In a real app, we would call an auth service to register or login
      console.log("Form data:", data)
      setTimeout(() => {
        setLoading(false)
        reset()
        // Refresh the page to simulate successful login
        window.location.reload()
      }, 1500)
    } catch (error) {
      console.error("Authentication error:", error)
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto py-8">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">{isLogin ? "Login to Your Account" : "Create an Account"}</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    {...register("firstName", { required: !isLogin && "First name is required" })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                  />
                  {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    {...register("lastName", { required: !isLogin && "Last name is required" })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                  />
                  {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
                </div>
              </>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-darkText hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
              >
                {loading ? "Processing..." : isLogin ? "Sign In" : "Sign Up"}
              </button>
            </div>
          </form>

          <div className="mt-4 text-center">
            <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-sm text-skyText hover:underline">
              {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
