"use client"

import Link from "next/link"
import Container from "./Container"
import Title from "./Title"
import Image from "next/image"

const DiscountBanner = () => {
  // Using the actual images now
  const discountImgOne = "/images/discountImgOne.png"
  const discountImgTwo = "/images/discountImgTwo.webp"
  const brandOne = "/images/brandOne.webp" // Xiaomi
  const brandTwo = "/images/brandTwo.webp" // Sony
  const brandThree = "/images/brandThree.webp" // Marshall
  const brandFour = "/images/brandFour.webp" // LG
  const brandFive = "/images/brandFive.webp" // LEEHUR
  const brandSix = "/images/brandSix.webp" // JBL

  const popularSearchItems = [
    { title: "Smart Watches", link: "smartWatches" },
    { title: "Headphone", link: "headphones" },
    { title: "Cameras", link: "camerasAndPhotos" },
    { title: "Audio", link: "tvAndAudio" },
    { title: "Laptop & Computers", link: "computersAndLaptop" },
    { title: "Cell Phone", link: "cellPhones" },
  ]

  return (
    <Container>
      <div>
        <Title text="Popular Search" />
        <div className="w-full h-[1px] bg-gray-200 mt-3" />
      </div>
      <div className="my-7 flex items-center flex-wrap gap-4">
        {popularSearchItems?.map(({ title, link }) => (
          <Link
            href={`/category/${link}`}
            key={title}
            className="border-[1px] border-gray-300 px-8 py-3 rounded-full capitalize font-medium hover:bg-black hover:text-white duration-200"
          >
            {title}
          </Link>
        ))}
      </div>
      <div className="w-full py-5 md:py-0 bg-[#F6F6F6] rounded-lg flex items-center justify-between overflow-hidden">
        <div className="hidden lg:block relative h-36 w-36">
          <Image src={discountImgOne || "/placeholder.svg"} alt="Sony Headphones" fill className="object-contain" />
        </div>
        <div className="flex flex-1 flex-col gap-1 items-center">
          <div className="flex items-center justify-center gap-x-3 text-xl md:text-4xl font-bold">
            <h2>Sony Headphone</h2>
            <Link
              href="/product"
              className="border border-red-600 px-4 py-2 text-xl md:text-3xl text-red-600 rounded-full"
            >
              Discount 20%
            </Link>
          </div>
          <p className="text-sm text-gray-600 font-medium">You're out to play or stepping out to make</p>
        </div>
        <div className="hidden lg:block relative h-36 w-36">
          <Image src={discountImgTwo || "/placeholder.svg"} alt="Designer Sunglasses" fill className="object-contain" />
        </div>
      </div>
      <div className="mt-7">
        <p className="font-bold text-2xl">Brands We Distribute</p>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 mt-7">
          <div className="border border-r-0 border-gray-300 flex items-center justify-center px-6 py-2 cursor-pointer group">
            <div className="relative w-36 h-20">
              <Image
                src={brandOne || "/placeholder.svg"}
                alt="Xiaomi"
                fill
                className="object-contain group-hover:opacity-50 duration-200"
              />
            </div>
          </div>
          <div className="border border-r-0 border-gray-300 flex items-center justify-center px-6 py-2 cursor-pointer group">
            <div className="relative w-36 h-20">
              <Image
                src={brandTwo || "/placeholder.svg"}
                alt="Sony"
                fill
                className="object-contain group-hover:opacity-50 duration-200"
              />
            </div>
          </div>
          <div className="border border-r-0 border-gray-300 flex items-center justify-center px-6 py-2 cursor-pointer group">
            <div className="relative w-36 h-20">
              <Image
                src={brandThree || "/placeholder.svg"}
                alt="Marshall"
                fill
                className="object-contain group-hover:opacity-50 duration-200"
              />
            </div>
          </div>
          <div className="border border-r-0 border-gray-300 flex items-center justify-center px-6 py-2 cursor-pointer group">
            <div className="relative w-36 h-20">
              <Image
                src={brandFour || "/placeholder.svg"}
                alt="LG"
                fill
                className="object-contain group-hover:opacity-50 duration-200"
              />
            </div>
          </div>
          <div className="border border-r-0 border-gray-300 flex items-center justify-center px-6 py-2 cursor-pointer group">
            <div className="relative w-36 h-20">
              <Image
                src={brandFive || "/placeholder.svg"}
                alt="LEEHUR"
                fill
                className="object-contain group-hover:opacity-50 duration-200"
              />
            </div>
          </div>
          <div className="border border-gray-300 flex items-center justify-center px-6 py-2 cursor-pointer group">
            <div className="relative w-36 h-20">
              <Image
                src={brandSix || "/placeholder.svg"}
                alt="JBL"
                fill
                className="object-contain group-hover:opacity-50 duration-200"
              />
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}

export default DiscountBanner
