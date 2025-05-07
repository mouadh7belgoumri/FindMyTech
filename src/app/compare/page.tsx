

import { FaPlusCircle } from "react-icons/fa";
import Link from "next/link";
import { IoArrowBackCircleOutline } from "react-icons/io5";

import React from 'react'

const compare = () => {
  return (
    <div className="flex justify-center bg-[#212026] items-center">
        <div className="h-screen  flex flex-col justify-around w-3/5  ">
        <div className="flex justify-around items-center align-middle gap-8 mt-10">
            <button className="w-64 h-80 border-2 border-gray-300 rounded-lg flex justify-center items-center bg-white bg-opacity-50 shadow-md cursor-pointer hover:bg-gray-200">
                <FaPlusCircle className="text-gray-500 text-4xl cursor-pointer hover:text-gray-700" />
            </button>
            <button className="w-64 h-80 border-2 border-gray-300 rounded-lg flex justify-center items-center cursor-pointer bg-white bg-opacity-50 shadow-md hover:bg-gray-200">
                <FaPlusCircle className="text-gray-500 text-4xl cursor-pointer hover:text-gray-700" />
            </button>
        </div>
    </div>
    </div>
  )
}

export default compare
