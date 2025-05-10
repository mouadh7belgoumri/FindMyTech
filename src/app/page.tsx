import { getProducts, getHighlights, getBlogs, getCategories } from "@/lib"
import BannerCategories from "@/components/ui/BannerCategories"
import Blog from "@/components/ui/Blog"
import Categories from "@/components/ui/Categories"
import DiscountBanner from "@/components/ui/DiscountBanner"
import Highlights from "@/components/ui/Highlights"
import HomeBanner from "@/components/ui/HomeBanner"
import ProductList from "@/components/ui/ProductList"
import { products, highlightsProducts, categories as mockCategories } from "@/lib/constants"

export default async function Home() {
  // Server component data fetching with fallbacks
  let productsData = { data: [] }
  let highlightsData = []
  let blogsData = []
  let categoriesData = []

  try {
    productsData = await getProducts()
  } catch (error) {
    console.error("Error fetching products in Home page:", error)
    productsData = { data: products }
  }

  try {
    highlightsData = await getHighlights()
  } catch (error) {
    console.error("Error fetching highlights in Home page:", error)
    highlightsData = highlightsProducts
  }

  try {
    blogsData = await getBlogs()
  } catch (error) {
    console.error("Error fetching blogs in Home page:", error)
    blogsData = blogsData
  }

  try {
    categoriesData = await getCategories()
  } catch (error) {
    console.error("Error fetching categories in Home page:", error)
    categoriesData = mockCategories
  }

  return (
    <div>
      <BannerCategories initialCategories={categoriesData} />
      <HomeBanner />
      <Highlights initialHighlights={highlightsData} />
      <Categories initialCategories={categoriesData} />
      <ProductList products={productsData?.data || []} />
      <DiscountBanner />
      <Blog initialBlogs={blogsData} />
    </div>
  )
}
