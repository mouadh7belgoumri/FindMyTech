import React from 'react'
import { IoArrowBackCircleOutline } from "react-icons/io5"
const SIgnUp = () => {
  return (
    <div className="bg-[#212026]">
      <div className="h-screen flex max-md:flex-col justify-center items-center content-center w-full" >
        <div className="flex h-2/3 w-1/3 max-md:h-1/2 max-md:w-full flex-col content-center items-center justify-between bg-[#717171] shadow-[0_0_15px_black]">
          <div className="flex w-full justify-start ">
            <IoArrowBackCircleOutline className='text-3xl cursor-pointer hover:text-white hover:drop-shadow-[0_0_10px_white] arrow-btn m-2' />
          </div>
          <h1 className='mt-8 text-4xl font-serif'><span className="text-[#2eabff] capitalize">find</span>My<span className="text-[#2eabff] capitalize inline-block">tech</span></h1>
          <h1 className='text-5xl font-[700] font-Poppins text-center'>welcome back</h1>
          <p className="text-2xl font text-center">login to continue your journey with us</p>
          <button className='border-btn w-fit p-2 px-8  cursor-pointer'>Sign in</button>
          <div className="h-1/4"></div>
        </div>
        <div className="flex h-2/3 w-1/3 max-md:h-fit max-md:p-5 max-md:w-full bg-black shadow-[0_0_15px_black]">
          <form action="" className="flex flex-col items-center justify-center w-full h-full content-center rounded-lg">
            <div className='leading-10'>
              <h1 className='text-5xl font-[700] font-Poppins text-center'>hello user</h1>
              <p className="text-l text-center font text-center">please enter your details</p>
            </div>
            <div className='flex flex-col xl:flex-row justify-around w-3/4'>
              <div className='flex flex-col items-center justify-start'>
                <div className="flex justify-start w-7/11">
                  <label htmlFor="first_name" className='text-[#D9D9D9]'> first name</label>
                </div>
                <input type="text" name='first_name' id='first_name' className='bg-white rounded-lg w-7/11 h-8 text-black px-2' />
              </div>
              <div className='flex flex-col items-center justify-start ' >
                <div className="flex justify-start w-7/11">
                  <label htmlFor="second_name" className='text-[#d9d9D9]'>second name</label></div>
                <input type="text" id='second_name' name='secon_name' className='bg-white rounded-lg w-7/11 h-8 text-black px-2' />
              </div>
            </div>
            <div className="flex justify-center content-center w-3/4 mt-5 ">
              <div className="flex flex-col items-center content-center justify-center">
                <div className="flex justify-start w-35 ml-1">
                  <label htmlFor="role" className='text-[#D9D9D9]'>register as</label>
                </div>
                <select name="role" id="role" className='bg-white rounded-lg w-35 h-8 text-black px-2'>
                  <option value="buyer">buyer</option>
                  <option value="seller">seller</option>
                </select>
              </div>
            </div>
            <div className="flex flex-col w-full content-center items-center justify-center">
              <div className="flex flex-col justify-center items-center content-center mt-10 w-full">
                <div className="flex justify-start w-2/3">
                  <label htmlFor="email" className='text-[#d9d9D9]'>Email</label>
                </div>
                <input type="email" name='email' id='email' className='bg-white rounded-lg h-10  w-2/3 text-black px-2' />
              </div>
              <div className="flex flex-col w-full content-center items-center justify-center mt-10 w-full">
                <div className="flex justify-start w-2/3">
                  <label htmlFor="password" className=' text-[#d9d9D9]'>Password</label></div>
                <input type="password" name='password' id='password' className='bg-white rounded-lg h-10 w-2/3 text-black px-2' />
              </div>
              <div className="flex justify-end w-2/3">
                <p  className='text-xs mt-2 text-[#D9D9D9] underline '>password must be at least 8 characters long</p>
              </div>

            </div>
            <input type="submit" name='Sign up' className='mt-10 w-fit bg-[#717171] rounded-md p-1 px-20 hover:cursor-pointer hover:bg-[#464646]' value="Sign in" />


          </form>
        </div>
      </div>
    </div>
  )
}

export default SIgnUp
