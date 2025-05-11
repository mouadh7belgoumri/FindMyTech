"use client"

import type React from "react"
import { useState } from "react"
import { IoArrowBackCircleOutline } from "react-icons/io5"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function SignUpPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

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
      alert("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      alert("Password must be at least 8 characters long.");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
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
   
      
   console.log(response);

    
    } catch (error) {
      console.error("Error during sign up:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-[#212026]">
      <div className="h-screen flex max-md:flex-col justify-center items-center content-center w-full">
        <div className="flex h-2/3 w-1/3 max-md:h-1/2 max-md:w-full flex-col content-center items-center justify-between bg-[#717171] shadow-[0_0_15px_black]">
          <div className="flex w-full justify-start ">
            <Link href="/">
              <IoArrowBackCircleOutline className="text-3xl cursor-pointer hover:text-white hover:drop-shadow-[0_0_10px_white] arrow-btn m-2" />
            </Link>
          </div>
          <h1 className="mt-8 text-4xl font-serif">
            <span className="text-[#2eabff] capitalize">find</span>My
            <span className="text-[#2eabff] capitalize inline-block">tech</span>
          </h1>
          <h1 className="text-5xl font-[700] font-Poppins text-center">welcome back</h1>
          <p className="text-2xl font text-center">login to continue your journey with us</p>
          <Link href={"/Sign_in"}>
            <button className="border-btn w-fit p-2 px-8  cursor-pointer">Sign in</button>
          </Link>
          <div className="h-1/4"></div>
        </div>
        <div className="flex h-2/3 w-1/3 max-md:h-fit max-md:p-5 max-md:w-full bg-black shadow-[0_0_15px_black]">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center justify-center w-full h-full content-center rounded-lg"
          >
            <div className="leading-10">
              <h1 className="text-5xl font-[700] font-Poppins text-center">hello user</h1>
              <p className="text-l font text-center">please enter your details</p>
            </div>
            <div className="flex flex-col xl:flex-row justify-around w-3/4">
              <div className="flex flex-col items-center justify-start">
                <div className="flex justify-start w-7/11">
                  <label htmlFor="first_name" className="text-[#D9D9D9]">
                    {" "}
                    first name
                  </label>
                </div>
                <input
                  type="text"
                  name="first_name"
                  id="first_name"
                  className="bg-white rounded-lg w-7/11 h-8 text-black px-2"
                />
              </div>
              <div className="flex flex-col items-center justify-start ">
                <div className="flex justify-start w-7/11">
                  <label htmlFor="last_name" className="text-[#d9d9D9]">
                    second name
                  </label>
                </div>
                <input
                  type="text"
                  id="second_name"
                  name="second_name"
                  className="bg-white rounded-lg w-7/11 h-8 text-black px-2"
                />
              </div>
            </div>
            <div className="flex flex-col w-full content-center items-center justify-center">
              <div className="flex flex-col justify-center items-center content-center mt-10 w-full">
                <div className="flex justify-start w-2/3">
                  <label htmlFor="email" className="text-[#d9d9D9]">
                    Email
                  </label>
                </div>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-white rounded-lg h-10  w-2/3 text-black px-2"
                />
              </div>
              <div className="flex flex-col  content-center items-center justify-center mt-10 w-full">
                <div className="flex justify-start w-2/3">
                  <label htmlFor="password" className=" text-[#d9d9D9]">
                    Password
                  </label>
                </div>
                <input
                  type="password"
                  name="password"
                  id="password"
                  className="bg-white rounded-lg h-10 w-2/3 text-black px-2"
                />
              </div>
              <div className="flex justify-end w-2/3">
                <p className="text-xs mt-2 text-[#D9D9D9] underline ">password must be at least 8 characters long</p>
              </div>
              <div className="flex flex-col  content-center items-center justify-center mt-3 w-full">
                <div className="flex justify-start w-2/3">
                  <label htmlFor="confirm_password" className=" text-[#d9d9D9]">
                    Confirm Password
                  </label>
                </div>
                <input
                  type="password"
                  name="confirm_password"
                  id="confirm_password"
                  className="bg-white rounded-lg h-10 w-2/3 text-black px-2"
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
              {loading ? "Submitting..." : "Sign up"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
