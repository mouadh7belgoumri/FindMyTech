"use client"

import { useEffect, useState } from "react"
import { getData } from "@/lib"
import Link from "next/link"

interface CategoryProps {
  _id: string
  _base: string
  name: string
}

interface Props {
  id: string | undefined
  initialCategories?: CategoryProps[]
}

const CategoryFilters = ({ id, initialCategories = [] }: Props) => {
  const [categories, setCategories] = useState<CategoryProps[]>(initialCategories)

  useEffect(() => {
    if (initialCategories.length > 0) {
      setCategories(initialCategories)
      return
    }

    const fetchData = async () => {
      const endpoint = "/api/categories"
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
    <div className="hidden md:inline-flex flex-col gap-6">
      <p className="text-3xl font-bold">Filters</p>
      <div>
        <p className="text-sm uppercase font-semibold underline underline-offset-2 decoration-[1px] mb-2">
          Select Categories
        </p>
        <div className="flex flex-col gap-y-2 min-w-40">
          {categories?.map((item: CategoryProps) => (
            <Link
              href={`/category/${item?._base}`}
              key={item?._id}
              className={`text-base font-medium text-start underline underline-offset-2 decoration-[1px] decoration-transparent hover:decoration-gray-950 hover:text-black duration-200 ${
                item?._base === id ? "text-greenText decoration-greenText" : "text-lightText"
              }`}
            >
              {item?.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CategoryFilters
