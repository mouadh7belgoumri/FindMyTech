"use client"

import { useEffect, useState } from "react"
import { getData } from "@/lib"
import Container from "./Container"
import Title from "./Title"
import Image from "next/image"

interface BlogProps {
  _id: string
  image: string
  _base: string
  title: string
}

interface BlogComponentProps {
  initialBlogs?: BlogProps[]
}

const Blog = ({ initialBlogs = [] }: BlogComponentProps) => {
  const [blogsData, setBlogsData] = useState<BlogProps[]>(initialBlogs)

  useEffect(() => {
    if (initialBlogs.length > 0) {
      setBlogsData(initialBlogs)
      return
    }

    const fetchData = async () => {
      const endpoint = "/api/blogs"
      try {
        const data = await getData(endpoint)
        setBlogsData(data)
      } catch (error) {
        console.error("Error fetching data", error)
      }
    }

    fetchData()
  }, [initialBlogs])

  return (
    <Container>
      <Title text="Our Blog Posts" className="text-center" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-7">
        {blogsData?.map((item: BlogProps) => (
          <div key={item?._id} className="group cursor-pointer">
            <div className="overflow-hidden">
              <div className="relative w-full h-64">
                <Image
                  src={item?.image || "/placeholder.svg"}
                  alt="blog-image"
                  fill
                  className="object-cover group-hover:scale-110 duration-300"
                />
              </div>
            </div>
            <div className="mt-5">
              <p className="text-sm uppercase font-medium text-gray-500">{item?._base}</p>
              <p className="text-2xl font-bold line-clamp-1">{item?.title}</p>
            </div>
          </div>
        ))}
      </div>
    </Container>
  )
}

export default Blog
