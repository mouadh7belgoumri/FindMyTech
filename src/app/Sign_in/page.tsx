"use client"

import { useState } from "react"
import { IoArrowBackCircleOutline } from "react-icons/io5"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import axios from "axios"
import { useMutation } from "@tanstack/react-query"
import { useToast } from "@/hooks/use-toast"

// Schema for login form validation
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password cannot be empty"),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function SignInPage() {
  const router = useRouter()
  const { toast } = useToast()
  
  // Setup React Hook Form with validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  // Setup React Query mutation for login
  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormData) => {
      const response = await axios.post("http://localhost:8012/server/login.php", data)
      return response.data
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: "You have successfully signed in!",
        variant: "success",
      })
      router.push("/profile")
    },
    onError: (error: any) => {
      toast({
        title: "Error signing in",
        description: error.response?.data?.message || "Invalid email or password. Please try again.",
        variant: "destructive",
      })
    },
  })
  
  // Submit handler
  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data)
  }

  return (
    <div>
      <div className="bg-gray-100">
        <div className="h-screen flex max-md:flex-col justify-center items-center content-center w-full">
          <div className="flex flex-col h-2/3 w-1/3 max-md:h-fit max-md:p-5 max-md:w-full bg-white shadow-lg rounded-l-lg">
            <div className="flex w-full justify-start">
              <Link href="/">
                <IoArrowBackCircleOutline className="text-3xl cursor-pointer text-gray-600 hover:text-gray-900 arrow-btn m-2" />
              </Link>
            </div>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col items-center justify-center w-full h-full content-center rounded-lg"
            >
              <div className="leading-10">
                <h1 className="text-5xl font-[700] font-Poppins text-center text-gray-800">Welcome back</h1>
                <p className="text-l text-center text-gray-600">Please enter your details</p>
              </div>

              <div className="flex flex-col w-full content-center items-center justify-center">
                <div className="flex flex-col justify-center items-center content-center mt-10 w-full">
                  <div className="flex justify-start w-2/3">
                    <label htmlFor="email" className="text-gray-700 font-medium">
                      Email
                    </label>
                  </div>
                  <input
                    {...register("email")}
                    type="email"
                    id="email"
                    aria-label="Email Address"
                    className={`bg-gray-50 border rounded-lg h-10 w-2/3 text-gray-800 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-2 border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1 w-2/3 text-left">{errors.email.message}</p>
                  )}
                </div>
                <div className="flex flex-col w-full content-center items-center justify-center mt-10 w-full">
                  <div className="flex justify-start w-2/3">
                    <label htmlFor="password" className="text-gray-700 font-medium">
                      Password
                    </label>
                  </div>
                  <input
                    {...register("password")}
                    type="password"
                    id="password"
                    aria-label="Password"
                    className={`bg-gray-50 border rounded-lg h-10 w-2/3 text-gray-800 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.password ? 'border-2 border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1 w-2/3 text-left">{errors.password.message}</p>
                  )}
                </div>
                <div className="flex justify-end w-2/3">
                  <Link href="/forgot_password" className="text-xs mt-2 text-blue-600 hover:text-blue-800 underline transition-colors">
                    Forgot password?
                  </Link>
                </div>
              </div>
              <button
                type="submit"
                disabled={loginMutation.isPending}
                className={`mt-10 w-fit bg-blue-600 hover:bg-blue-700 rounded-md p-2 px-20 text-white font-medium transition-all ease-in-out duration-300 ${
                  loginMutation.isPending ? "opacity-70 cursor-not-allowed" : "hover:shadow-md"
                }`}
              >
                {loginMutation.isPending ? (
                  <div className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Signing in...</span>
                  </div>
                ) : "Sign in"}
              </button>
            </form>
          </div>
          <div className="flex h-2/3 w-1/3 flex-col max-md:h-1/2 max-md:p-5 max-md:w-full content-center items-center justify-between bg-blue-600 text-white shadow-lg rounded-r-lg">
            <h1 className="mt-8 text-4xl font-serif">
              <span className="text-white capitalize font-bold">find</span>My
              <span className="text-white capitalize inline-block font-bold">tech</span>
            </h1>
            <div className="text-center px-6">
              <h1 className="text-5xl font-[700] font-Poppins mb-4">Hello there</h1>
              <p className="text-xl text-gray-100">
                Enter your personal details and start your journey with us
              </p>
            </div>
            <Link href={"/Sign_up"} className="mb-12">
              <button className="bg-white text-blue-600 hover:bg-gray-100 transition-all duration-300 font-medium rounded-md w-fit p-2 px-8 shadow-md">
                Sign up
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
