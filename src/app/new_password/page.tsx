"use client"

import type React from "react"
import { useState } from "react"
import { IoArrowBackCircleOutline } from "react-icons/io5"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function NewPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  })
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    if (formData.password.length < 8) {
      alert("Password must be at least 8 characters long.")
      setLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.")
      setLoading(false)
      return
    }

    try {
      // In a real app, we would call an API endpoint
      // For now, we'll just simulate a successful response
      setTimeout(() => {
        alert("Password reset successful!")
        router.push("/Sign_in")
      }, 1500)
    } catch (error) {
      console.error(error)
      alert("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#212026]">
      <div className="h-screen flex max-md:flex-col justify-center items-center content-center w-full">
        {/* Form Section */}
        <div className="flex flex-col h-2/3 w-1/3 max-md:h-fit max-md:p-5 max-md:w-full bg-black shadow-[0_0_15px_black]">
          <div className="flex w-full justify-start">
            <IoArrowBackCircleOutline
              className="text-3xl cursor-pointer hover:text-white hover:drop-shadow-[0_0_10px_white] arrow-btn m-2"
              onClick={() => router.back()} // Navigate back
            />
          </div>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center justify-center w-full h-full content-center rounded-lg"
          >
            <div className="leading-10">
              <h1 className="text-5xl font-[700] font-Poppins text-center">New Password</h1>
              <p className="text-l text-center font text-center">Create a new password for your account</p>
            </div>

            <div className="flex flex-col w-full content-center items-center justify-center">
              <div className="flex flex-col justify-center items-center content-center mt-10 w-full">
                <div className="flex justify-start w-2/3">
                  <label htmlFor="password" className="text-[#d9d9D9]">
                    New Password
                  </label>
                </div>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  aria-label="New Password"
                  className="bg-white rounded-lg h-10 w-2/3 text-black px-2"
                  required
                />
              </div>
              <div className="flex justify-end w-2/3">
                <p className="text-xs mt-2 text-[#D9D9D9] underline">Password must be at least 8 characters long</p>
              </div>
              <div className="flex flex-col justify-center items-center content-center mt-5 w-full">
                <div className="flex justify-start w-2/3">
                  <label htmlFor="confirmPassword" className="text-[#d9d9D9]">
                    Confirm Password
                  </label>
                </div>
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  aria-label="Confirm Password"
                  className="bg-white rounded-lg h-10 w-2/3 text-black px-2"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`mt-10 w-fit bg-[#717171] rounded-md p-1 px-20 ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:cursor-pointer hover:bg-[#464646]"
              }`}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </div>

        {/* Info Section */}
        <div className="flex h-2/3 w-1/3 flex-col max-md:h-1/2 max-md:p-5 max-md:w-full content-center items-center justify-between bg-[#717171] shadow-[0_0_15px_black]">
          <h1 className="mt-8 text-4xl font-serif">
            <span className="text-[#2eabff] capitalize">find</span>My
            <span className="text-[#2eabff] capitalize inline-block">tech</span>
          </h1>
          <h1 className="text-5xl font-[700] font-Poppins text-center">Hello user</h1>
          <p className="text-2xl font text-center w-3/4">Create a strong password to secure your account</p>
          <Link href={"/Sign_in"}>
            <button className="border-btn w-fit p-2 px-8 cursor-pointer">Sign in</button>
          </Link>
          <div className="h-1/4"></div>
        </div>
      </div>
    </div>
  )
}
