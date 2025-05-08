"use client"

import type React from "react"
import { useState } from "react"
import { IoArrowBackCircleOutline } from "react-icons/io5"
import Link from "next/link"

export default function EditProfilePage() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<{
    username: string
    email: string
    bio: string
    password: string
    profilePicture: File | null
  }>({
    username: "",
    email: "",
    bio: "",
    password: "",
    profilePicture: null,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, profilePicture: e.target.files[0] })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      // Simulate API call
      console.log("Form data submitted:", formData)
    } catch (error) {
      console.error("Error updating profile:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="flex flex-row justify-center bg-[#212026]">
        <div className="h-screen flex max-md:flex-col justify-center items-center content-center w-full">
          <div className="flex h-2/3 w-1/3 max-md:h-1/2 max-md:w-full flex-col content-center items-center justify-between bg-[#717171] shadow-[0_0_15px_black]">
            <div className="flex w-full justify-start">
              <Link href={"/profile"}>
                <button className="text-white text-2xl p-4">
                  <IoArrowBackCircleOutline className="hover:drop-shadow-[0_0_10px_white] hover:cursor-pointer" />
                </button>
              </Link>
            </div>
            <form className="flex flex-col w-full h-full p-4" onSubmit={handleSubmit}>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
                className="p-2 mb-4 border border-gray-300 rounded"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="p-2 mb-4 border border-gray-300 rounded"
              />
              <input
                type="password"
                name="password"
                placeholder="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="p-2 mb-4 border border-gray-300 rounded"
              />
              <textarea
                name="bio"
                placeholder="Bio"
                value={formData.bio}
                onChange={handleChange}
                className="p-2 mb-4 border border-gray-300 rounded"
              />

              <button
                type="submit"
                className={`bg-blue-500 text-white p-2 rounded ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                } hover:bg-blue-700 hover:cursor-pointer`}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
