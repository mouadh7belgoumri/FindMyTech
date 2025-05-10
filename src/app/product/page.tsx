import { getProducts, getCategories } from "@/lib"
import Container from "@/components/ui/Container"
import Title from "@/components/ui/Title"
import CategoryFilters from "@/components/ui/CategoryFilters"
import ProductCard from "@/components/ui/ProductCard"

export default async function ProductPage() {
  const products = await getProducts()
  const categories = await getCategories()

  return (
    <Container>
      <div className="flex items-start gap-10">
        <CategoryFilters id={undefined} initialCategories={categories} />
        <div className="flex-1">
          <Title text="Products Collection" className="text-center mb-5" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {products?.data?.map((item: any) => (
              <ProductCard item={item} key={item?._id} />
            ))}
          </div>
        </div>
      </div>
    </Container>
  )
}
