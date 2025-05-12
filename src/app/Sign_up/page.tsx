"use client"

import type React from "react"
import { useState } from "react"
import { IoArrowBackCircleOutline } from "react-icons/io5"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function SignUpPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = {
      email: (e.target as any).email.value,
      password: (e.target as any).password.value,
      confirmPassword: (e.target as any).confirm_password.value,
      firstName: (e.target as any).first_name.value,
      secondName: (e.target as any).second_name.value,
    };

    // Validation
    if (!formData.email.includes("@")) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "Please ensure both passwords match.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      // Send data to the endpoint
      const response = await fetch("http://localhost:8012/server/register.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          confirm_password: formData.confirmPassword,
          first_name: formData.firstName,
          last_name: formData.secondName,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: "Success",
          description: "Registration successful! You can now sign in.",
          variant: "success",
        });
        router.push('/Sign_in');
      } else {
        toast({
          title: "Registration Failed",
          description: data.message || "An error occurred during registration.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error during sign up:", error);
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-gray-100">
      <div className="h-screen flex max-md:flex-col justify-center items-center content-center w-full">
        <div className="flex h-2/3 w-1/3 max-md:h-1/2 max-md:w-full flex-col content-center items-center justify-between bg-blue-600 text-white shadow-lg rounded-l-lg">
          <div className="flex w-full justify-start ">
            <Link href="/">
              <IoArrowBackCircleOutline className="text-3xl cursor-pointer hover:text-gray-200 hover:drop-shadow-md arrow-btn m-2" />
            </Link>
          </div>
          <h1 className="mt-8 text-4xl font-serif">
            <span className="text-white capitalize font-bold">find</span>My
            <span className="text-white capitalize inline-block font-bold">tech</span>
          </h1>
          <div className="text-center px-6">
            <h1 className="text-5xl font-[700] font-Poppins mb-4">Welcome back</h1>
            <p className="text-xl text-gray-100">Login to continue your journey with us</p>
          </div>
          <Link href={"/Sign_in"} className="mb-12">
            <button className="bg-white text-blue-600 hover:bg-gray-100 transition-all duration-300 font-medium rounded-md w-fit p-2 px-8 shadow-md">
              Sign in
            </button>
          </Link>
        </div>
        <div className="flex h-2/3 w-1/3 max-md:h-fit max-md:p-5 max-md:w-full bg-white shadow-lg rounded-r-lg">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center justify-center w-full h-full content-center rounded-lg"
          >
            <div className="leading-10">
              <h1 className="text-5xl font-[700] font-Poppins text-center text-gray-800">Hello user</h1>
              <p className="text-l text-gray-600 text-center">Please enter your details</p>
            </div>
            <div className="flex flex-col xl:flex-row justify-around w-3/4 gap-4 mt-6">
              <div className="flex flex-col items-center justify-start">
                <div className="flex justify-start w-full">
                  <label htmlFor="first_name" className="text-gray-700 font-medium">
                    First name
                  </label>
                </div>
                <input
                  type="text"
                  name="first_name"
                  id="first_name"
                  className="bg-gray-50 border border-gray-300 rounded-lg w-full h-10 text-gray-800 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex flex-col items-center justify-start">
                <div className="flex justify-start w-full">
                  <label htmlFor="second_name" className="text-gray-700 font-medium">
                    Second name
                  </label>
                </div>
                <input
                  type="text"
                  id="second_name"
                  name="second_name"
                  className="bg-gray-50 border border-gray-300 rounded-lg w-full h-10 text-gray-800 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex flex-col w-full content-center items-center justify-center">
              <div className="flex flex-col justify-center items-center content-center mt-6 w-full">
                <div className="flex justify-start w-2/3">
                  <label htmlFor="email" className="text-gray-700 font-medium">
                    Email
                  </label>
                </div>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 rounded-lg h-10 w-2/3 text-gray-800 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex flex-col content-center items-center justify-center mt-6 w-full">
                <div className="flex justify-start w-2/3">
                  <label htmlFor="password" className="text-gray-700 font-medium">
                    Password
                  </label>
                </div>
                <input
                  type="password"
                  name="password"
                  id="password"
                  className="bg-gray-50 border border-gray-300 rounded-lg h-10 w-2/3 text-gray-800 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end w-2/3">
                <p className="text-xs mt-2 text-gray-500">Password must be at least 8 characters long</p>
              </div>
              <div className="flex flex-col content-center items-center justify-center mt-3 w-full">
                <div className="flex justify-start w-2/3">
                  <label htmlFor="confirm_password" className="text-gray-700 font-medium">
                    Confirm Password
                  </label>
                </div>
                <input
                  type="password"
                  name="confirm_password"
                  id="confirm_password"
                  className="bg-gray-50 border border-gray-300 rounded-lg h-10 w-2/3 text-gray-800 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`mt-8 w-fit bg-blue-600 hover:bg-blue-700 rounded-md p-2 px-20 text-white font-medium transition-all ease-in-out duration-300 ${
                loading ? "opacity-70 cursor-not-allowed" : "hover:shadow-md"
              }`}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Signing up...</span>
                </div>
              ) : "Sign up"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
