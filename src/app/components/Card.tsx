import Image from 'next/image'
import Placeholdedr_image from '../assets/images/Placeholder_image.svg'
export default function Card() {
  return (
    <>
      <div className="flex  justify-center items-center content-center h-screen fixed top-0 ">
        <div className='flex flex-col lg:w-1/6 lg:h-1/2 bg-[#c9bcbb] bg-opacity-40 absolute '>
          <Image alt='' src={Placeholdedr_image} className='h-80 w-80 rounded-lg f ' />
          
        </div>
        
      </div>
      
    </>
  )

};
