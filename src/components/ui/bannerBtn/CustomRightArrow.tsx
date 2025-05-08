"use client"

import { IoIosArrowForward } from "react-icons/io"

const CustomRightArrow = ({ onClick }: any) => {
  return (
    <button
      onClick={onClick}
      className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-md p-1 rounded-full z-10 hover:bg-black hover:text-white duration-200"
    >
      <IoIosArrowForward />
    </button>
  )
}

export default CustomRightArrow
