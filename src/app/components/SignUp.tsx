import React from 'react'
import { IoArrowBackCircleOutline } from "react-icons/io5"
const SIgnUp = () => {
  return (
    <div>
      <div className="h-screen flex justify-center items-center content-center w-full">
        <div className="flex h-2/3 w-1/3 flex-col content-center items-center justify-between bg-[#717171] ">
          <div className="flex w-full justify-start arrow-btn">
            <IoArrowBackCircleOutline className='text-3xl cursor-pointer arrow-btn m-2' />
          </div>
          <h1 className='mt-8 text-4xl font-serif'><span className="text-[#2eabff] capitalize">find</span>My<span className="text-[#2eabff] capitalize inline-block">tech</span></h1>
          <h1 className='text-5xl font-[700] font-Poppins'>welcome back</h1>
          <p className="text-2xl font">login to continue your journey with us</p>
          <button className='border-btn w-fit p-2 px-8  cursor-pointer'>Sign Up</button>
          <div className="h-1/4"></div>
        </div>
        <div className="flex h-1/2 w-1/3"></div>
      </div>
    </div>
  )
}

export default SIgnUp
