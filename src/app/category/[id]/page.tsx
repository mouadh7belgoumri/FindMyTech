import { getProductsByCategory, getCategories } from "@/lib"
import CategoryFilters from "@/components/ui/CategoryFilters"
import Container from "@/components/ui/Container"
import ProductCard from "@/components/ui/ProductCard"
import Title from "@/components/ui/Title"
import { products, categories as mockCategories } from "@/lib/constants"

export default async function CategoryPage({ params }: { params: { id: string } }) {
  // Fetch data with fallbacks
  let productsData = []
  let categoriesData = []

  try {
    productsData = await getProductsByCategory(params.id)
  } catch (error) {
    console.error(`Error fetching products for category ${params.id}:`, error)
    // Filter mock data as fallback
    productsData = products.filter((p) => p._base === params.id)
  }

  try {
    categoriesData = await getCategories()
  } catch (error) {
    console.error("Error fetching categories:", error)
    categoriesData = mockCategories
  }

  // Helper function to format category ID for display
  const formatId = (id: string) => {
    return id.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/(^\w|\s\w)/g, (match) => match.toUpperCase())
  }

  return (
    <Container>
      <Title text={formatId(params.id)} className="text-center mb-5" />
      <div className="flex items-start gap-10">
        <CategoryFilters id={params.id} initialCategories={categoriesData} />
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {productsData?.map((item: any) => (
              <ProductCard item={item} key={item?._id} />
            ))}
          </div>
        </div>
      </div>
    </Container>
  )
}
