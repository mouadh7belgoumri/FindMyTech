"use client"

import { IoIosArrowBack } from "react-icons/io"

const CustomLeftArrow = ({ onClick }: any) => {
  return (
    <button
      onClick={onClick}
      className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-md p-1 rounded-full z-10 hover:bg-black hover:text-white duration-200"
    >
      <IoIosArrowBack />
    </button>
  )
}

export default CustomLeftArrow
