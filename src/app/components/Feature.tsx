import React from 'react'
import Image from 'next/image'
import featureImage from '../assets/images/feature.png'
import Link from 'next/link'

const Feature = () => {
  return (
    <>
      <div className="hero flex flex-col justify-center items-center bg-100 relative h-1/2 w-full z-[-1]">
        <div className="flex content-center items-center text-bold flex-col h-1/2 w-full">
          <div className=" text-center flex flex-col font-serif relative  h-1/3  sm:h-1/2 lg:h-4/5  w-full">
            <Image alt='' src={featureImage} className='h-full w-auto' />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col justify-evenly hero-text">
              
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Feature
