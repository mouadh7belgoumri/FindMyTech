import React from 'react'
import Image from 'next/image'
import heroImage from '../assets/images/Hero.png'

const Hero = () => {
  return (
    <>
      <div className="hero flex flex-col justify-center items-center bg-100 relative h-auto mt-">
        <div className="flex content-center items-center text-bold flex-col">
          <div className="absolute  text-center flex flex-col font-serif relative">
            <Image alt='' src={heroImage} className='h-full w-auto' />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col justify-evenly hero-text">
              <h1 className='text-xl'>easy pc building</h1>
              <h1 className='text-4xl'>choosing parts is no more a challenge</h1>
            </div>
          </div>
        </div>
      </div>


    </>
  )
}

export default Hero
