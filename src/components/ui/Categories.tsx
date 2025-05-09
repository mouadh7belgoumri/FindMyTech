"use client"

import { useEffect, useState } from "react"
import { getData } from "@/lib"
import Container from "./Container"
import Title from "./Title"
import Link from "next/link"
import Image from "next/image"

interface CategoryProps {
  _id: string
  image: string
  _base: string
  name: string
}

interface CategoriesComponentProps {
  initialCategories?: CategoryProps[]
}

const Categories = ({ initialCategories = [] }: CategoriesComponentProps) => {
  const [categories, setCategories] = useState<CategoryProps[]>(initialCategories)

  useEffect(() => {
    if (initialCategories.length > 0) {
      setCategories(initialCategories)
      return
    }

    const fetchData = async () => {
      const endpoint = "/app/api/category"
      try {
        const data = await getData(endpoint)
        setCategories(data)
      } catch (error) {
        console.error("Error fetching data", error)
      }
    }

    fetchData()
  }, [initialCategories])

  return (
    <Container>
      <div className="mb-10">
        <div className="flex items-center justify-between">
          <Title text="Popular categories" />
          <Link href="/category/tvAndAudio" className="font-medium relative group overflow-hidden">
            View All Categories
            <span className="absolute bottom-0 left-0 w-full block h-[1px] bg-gray-600 -translate-x-[100%] group-hover:translate-x-0 duration-300" />
          </Link>
        </div>
        <div className="w-full h-[1px] bg-gray-200 mt-3" />
      </div>
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-7">
        {categories?.map((item: CategoryProps) => (
          <Link
            href={`/category/${item?._base}`}
            key={item?._id}
            className="w-full h-auto relative group overflow-hidden"
          >
            <div className="relative w-full h-40">
              <Image
                src={item?.image || "/placeholder.svg"}
                alt="cat-image"
                fill
                className="rounded-md object-cover group-hover:scale-110 duration-300"
              />
            </div>
            <div className="absolute bottom-3 w-full text-center">
              <p className="text-sm md:text-base font-bold">{item?.name}</p>
            </div>
          </Link>
        ))}
      </div>
    </Container>
  )
}

export default Categories
