import { getProducts } from "@/lib"
import Container from "@/components/ui/Container"
import Title from "@/components/ui/Title"
import CategoryFilters from "@/components/ui/CategoryFilters"
import ProductList from "@/components/ui/ProductList"

export default async function CategoryPage() {
  const products = await getProducts()

  return (
    <Container>
      <div className="flex gap-10">
        <CategoryFilters id={undefined} />
        <div className="flex-1">
          <Title text="All Categories" />
          <div className="mt-8">
            <ProductList products={products?.data || []} />
          </div>
        </div>
      </div>
    </Container>
  )
}
