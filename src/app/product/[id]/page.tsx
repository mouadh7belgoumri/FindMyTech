import { getProduct } from "@/lib"
import Container from "@/components/ui/Container"
import Image from "next/image"
import PriceTag from "@/components/ui/PriceTag"
import FormattedPrice from "@/components/ui/FormattedPrice"
import AddToCardBtn from "@/components/ui/AddToCardBtn"
import ProductFeatures from "@/components/ui/ProductFeatures"

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id)

  if (!product) {
    return (
      <Container>
        <div className="text-center">
          <h1 className="text-3xl font-bold">Product Not Found</h1>
          <p className="mt-4">The product you are looking for does not exist.</p>
        </div>
      </Container>
    )
  }

  return (
    <Container>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="flex items-start">
          <div className="relative w-full h-[400px]">
            <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-contain" />
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="text-3xl font-bold">{product.name}</h2>
          <div className="flex items-center justify-between">
            <PriceTag
              regularPrice={product.regularPrice}
              discountedPrice={product.discountedPrice}
              className="text-xl"
            />
          </div>
          <p>
            You are saving{" "}
            <span className="text-base font-semibold text-green-500">
              <FormattedPrice amount={product.regularPrice - product.discountedPrice} />
            </span>{" "}
            upon purchase
          </p>

          {product.brand && (
            <p>
              Brand: <span className="font-medium">{product.brand}</span>
            </p>
          )}

          <p>
            Category: <span className="font-medium">{product.category}</span>
          </p>

          <p className="text-gray-700">{product.description}</p>

          <AddToCardBtn
            className="bg-black/80 py-3 text-base text-gray-200 hover:scale-100 hover:text-white duration-200"
            title="Buy now"
            product={product}
          />

          <div className="bg-[#f7f7f7] p-5 rounded-md flex flex-col items-center justify-center gap-2">
            <p className="font-semibold">Guaranteed safe & secure checkout</p>
          </div>
        </div>
        <ProductFeatures />
      </div>
    </Container>
  )
}
