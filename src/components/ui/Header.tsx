"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { FiShoppingBag, FiStar, FiUser } from "react-icons/fi"
import { IoClose, IoSearchOutline } from "react-icons/io5"
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react"
import { FaChevronDown } from "react-icons/fa6"
import { getData } from "@/lib"
import Container from "./Container"
import { store } from "@/lib/store"
import ProductCard from "./ProductCard"
import { usePathname } from "next/navigation"

interface CategoryProps {
  _id: string
  image: string
  _base: string
  name: string
}

interface ProductProps {
  _id: string
  name: string
  image: string
  category: string
  regularPrice: number
  discountedPrice: number
  isNew: boolean
  [key: string]: any
}

const Header = () => {
  const [searchText, setSearchText] = useState("")
  const [products, setProducts] = useState<ProductProps[]>([])
  const [categories, setCategories] = useState<CategoryProps[]>([])
  const [filteredProducts, setFilteredProducts] = useState<ProductProps[]>([])
  const { currentUser, cartProduct, favoriteProduct } = store()
  const pathname = usePathname()

  // Logo placeholder
  const logo = "/placeholder.svg?height=80&width=176"

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getData("http://localhost:3000/api/products")
        setProducts(data?.data || [])
      } catch (error) {
        console.error("Error fetching products:", error)
      }
    }

    fetchProducts()
  }, [])

  useEffect(() => {
    const fetchCategories = async () => {
      const endpoint = "http://localhost:3000/api/categories"
      try {
        const data = await getData(endpoint)
        setCategories(data)
      } catch (error) {
        console.error("Error fetching data", error)
      }
    }

    fetchCategories()
  }, [])

  useEffect(() => {
    const filtered = products.filter((item: ProductProps) =>
      item?.name.toLocaleLowerCase().includes(searchText.toLowerCase()),
    )
    setFilteredProducts(filtered)
  }, [searchText, products])

  const bottomNavigation = [
    { title: "Home", link: "/" },
    { title: "Shop", link: "/product" },
    { title: "Cart", link: "/cart" },
    { title: "Orders", link: "/orders" },
    { title: "My Account", link: "/profile" },
    { title: "Blog", link: "/blog" },
  ]

  return (
    <div className="w-full bg-whiteText sticky top-0 z-50">
      <div className="max-w-screen-xl mx-auto h-20 flex items-center justify-between px-4 lg:px-0">
        <Link href="/">
          <div className="relative w-44 h-12">
            <Image src={logo || "/placeholder.svg"} alt="logo" fill className="object-contain" />
          </div>
        </Link>
        <div className="hidden md:inline-flex max-w-3xl w-full relative">
          <input
            type="text"
            onChange={(e) => setSearchText(e.target.value)}
            value={searchText}
            placeholder="Search products"
            className="w-full flex-1 rounded-full border-0 py-2 text-gray-900 text-lg placeholder:text-base placeholder:tracking-wide shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 placeholder:font-normal focus:ring-1 focus:ring-inset focus:ring-darkText sm:text-sm sm:leading-6 px-4"
          />
          {searchText ? (
            <IoClose
              onClick={() => setSearchText("")}
              className="absolute top-2.5 right-4 text-xl hover:text-red-500 cursor-pointer duration-200"
            />
          ) : (
            <IoSearchOutline className="absolute top-2.5 right-4 text-xl" />
          )}
        </div>
        {searchText && (
          <div className="absolute left-0 top-20 w-full mx-auto max-h-[500px] px-10 py-5 bg-white z-20 overflow-y-scroll cursor-pointer text-black shadow-lg shadow-skyText scrollbar-hide">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
                {searchText &&
                  filteredProducts.map((item: ProductProps) => (
                    <ProductCard key={item._id} item={item} setSearchText={setSearchText} />
                  ))}
              </div>
            ) : (
              <div className="py-10 bg-gray-50 w-full flex items-center justify-center border border-gray-600 rounded-md">
                <p className="text-xl font-normal">
                  Nothing matches with your search keywords{" "}
                  <span className="underline underline-offset-2 decoration-[1px] text-red-500 font-semibold">{`(${searchText})`}</span>
                  . Please try again
                </p>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center gap-x-6 text-2xl">
          <Link href="/profile">
            {currentUser ? (
              <div className="relative w-10 h-10">
                <Image
                  src={currentUser?.avatar || "/placeholder.svg"}
                  alt="user-avatar"
                  fill
                  className="rounded-full object-cover"
                />
              </div>
            ) : (
              <FiUser className="hover:text-skyText duration-200 cursor-pointer" />
            )}
          </Link>
          <Link href="/favorite" className="relative block">
            <FiStar className="hover:text-skyText duration-200 cursor-pointer" />
            <span className="inline-flex items-center justify-center bg-redText text-whiteText absolute -top-1 -right-2 text-[9px] w-4 h-4 rounded-full">
              {favoriteProduct?.length ? favoriteProduct?.length : 0}
            </span>
          </Link>
          <Link href="/cart" className="relative block">
            <FiShoppingBag className="hover:text-skyText duration-200 cursor-pointer" />
            <span className="inline-flex items-center justify-center bg-redText text-whiteText absolute -top-1 -right-2 text-[9px] w-4 h-4 rounded-full">
              {cartProduct?.length ? cartProduct?.length : 0}
            </span>
          </Link>
        </div>
      </div>
      <div className="w-full bg-darkText text-whiteText">
        <Container className="py-2 max-w-4xl flex items-center gap-5 justify-between">
          <Menu>
            <MenuButton className="inline-flex items-center gap-2 rounded-md border border-gray-400 hover:border-white py-1.5 px-3 text-sm/6 font-semibold text-gray-300 hover:text-white">
              Select Category
              <FaChevronDown className="" />
            </MenuButton>
            <Transition
              enter="transition ease-out duration-75"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <MenuItems className="absolute w-52 origin-top-left rounded-xl border border-white/5 bg-black p-1 text-sm/6 text-gray-300 focus:outline-none hover:text-white z-50">
                {categories?.map((item: CategoryProps) => (
                  <MenuItem key={item?._id}>
                    <Link
                      href={`/category/${item?._base}`}
                      className="group flex w-full items-center gap-2 rounded-lg py-2 px-3 hover:bg-white/20 tracking-wide"
                    >
                      <div className="relative w-6 h-6">
                        <Image
                          src={item?.image || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="rounded-md object-cover"
                        />
                      </div>
                      {item?.name}
                    </Link>
                  </MenuItem>
                ))}
              </MenuItems>
            </Transition>
          </Menu>
          {bottomNavigation.map(({ title, link }) => (
            <Link
              href={link}
              key={title}
              className={`uppercase hidden md:inline-flex text-sm font-semibold text-whiteText/90 hover:text-white duration-200 relative overflow-hidden group ${
                pathname === link ? "text-white" : ""
              }`}
            >
              {title}
              <span className="inline-flex w-full h-[1px] bg-whiteText absolute bottom-0 left-0 transform -translate-x-[105%] group-hover:translate-x-0 duration-300" />
            </Link>
          ))}
        </Container>
      </div>
    </div>
  )
}

export default Header
