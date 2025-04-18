import React from 'react'
import Image from 'next/image'
import heroImage from '../assets/images/Hero.png'

const Hero = () => {
  return (
    <>
      <div className="hero flex flex-col justify-center items-center bg-100 relative h-auto">
        <div className="flex content-center items-center text-bold flex-col h-1/2">
          <div className=" text-center flex flex-col font-serif fixed relative h-1/3 sm:h-1/2 lg:h-4/5  w-full">
            <Image alt='' src={heroImage} className='h-full w-auto' />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col justify-evenly hero-text">
              <h1 className='lg:text-5xl max-lg:text-3xl max-sm:text-xl font-poppins'>Easy pc building</h1>
              <h1 className='lg:text-7xl max-lg:text-5xl max-sm:text-3xl'>Choosing parts is no more a challenge</h1>
            </div>
          </div>
        </div>
      </div>


    </>
  )
}

export default Hero
