import { getProducts, getHighlights, getBlogs, getCategories } from "@/lib"
import BannerCategories from "@/components/ui/BannerCategories"
import Blog from "@/components/ui/Blog"
import Categories from "@/components/ui/Categories"
import DiscountBanner from "@/components/ui/DiscountBanner"
import Highlights from "@/components/ui/Highlights"
import HomeBanner from "@/components/ui/HomeBanner"
import ProductList from "@/components/ui/ProductList"
import Header from "@/components/ui/Header"
import Footer from "@/components/ui/Footer"
import { Toaster } from "react-hot-toast"

export default async function Home() {
  // Server component data fetching
  const products = await getProducts()
  const highlights = await getHighlights()
  const blogs = await getBlogs()
  const categories = await getCategories()

  return (
    <div>
      <Header />
      <BannerCategories initialCategories={categories} />
      <HomeBanner />
      <Highlights initialHighlights={highlights} />
      <Categories initialCategories={categories} />
      <ProductList products={products?.data || []} />
      <DiscountBanner />
      <Blog initialBlogs={blogs} />
      <Footer />
      <Toaster
        position="bottom-right"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        toastOptions={{
          style: {
            backgroundColor: "black",
            color: "white",
          },
        }}
      />
    </div>
  )
}
