import Image from 'next/image'
import Placeholdedr_image from '../assets/images/Placeholder_image.svg'
import star from '../assets/images/Card/star.svg'

export default function Card() {
  return (
    <>
      <div className="flex  justify-center items-center content-center h-screen bg-red-200 ">
        <div className='flex flex-col card  bg-[#c9bcbb80]  bg-opacity-40 rounded-2xl justify-start items-start absolute '>
          <Image alt='' src={Placeholdedr_image} className=' rounded-3xl p-3 ' />
          <div className="flex flex-col justify-around items start  text-black  ml-3">
            <p className="card-text bg-white p-1 px-2 rounded-lg">computer component</p>

          </div>
          <div className="flex flex-row justify-between px-4 items-center w-full  ">
            <h1 className='text-black mt-2  text-xl card-title  '>Product name</h1>
            <div className='text-black'>
              <p className='inline-block text-center align-middle mt-2'>4.8 </p>
              <Image src={star} alt='' className='star inline align-middle mt-1 ml-[2px]' />

            </div>
          </div>
          <div className="flex flex-row justify-between items-end h-full w-full mt-4 pl-4 pr-1 mb-2 m-md ">
            <p className="text-black price font-semibold">$199.99</p>
            <button className="bg-[#D9D9D9] text-black button button-text px-4 py-2 rounded-4xl hover:bg-blue-600 hover:cursor-pointer hover:text-white hover:transition-all hover:duration-300">
              Add to Cart
            </button>
          </div>
        </div>

      </div>

    </>
  )

};
