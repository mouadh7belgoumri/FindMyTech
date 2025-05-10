import { getProduct } from "@/lib"
import Container from "@/components/ui/Container"
import Image from "next/image"
import PriceTag from "@/components/ui/PriceTag"
import FormattedPrice from "@/components/ui/FormattedPrice"
import AddToCardBtn from "@/components/ui/AddToCardBtn"
import ProductFeatures from "@/components/ui/ProductFeatures"
import { products } from "@/lib/constants"

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  // Try to get product with fallback to mock data
  let product = null

  try {
    product = await getProduct(params.id)
  } catch (error) {
    console.error(`Error fetching product with id ${params.id}:`, error)
    // Find the product in the mock data
    product = products.find((p) => p._id === params.id)
  }

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

  // Ensure image path is correct
  const imagePath = product.image.startsWith("http")
    ? product.image
    : `${process.env.NEXT_PUBLIC_IMAGE_PATH || ""}${product.image}`

  return (
    <Container>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="flex items-start">
          <div className="relative w-full h-[400px]">
            <Image
              src={imagePath || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-contain"
              unoptimized={imagePath.startsWith("http")} // Skip optimization for external images
            />
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="text-3xl font-bold">{product.name}</h2>
          <div className="flex items-center justify-between">
            <PriceTag
              regularPrice={product.regularPrice || product.price}
              discountedPrice={product.discountedPrice}
              className="text-xl"
            />
          </div>
          {product.regularPrice && product.discountedPrice && (
            <p>
              You are saving{" "}
              <span className="text-base font-semibold text-green-500">
                <FormattedPrice amount={product.regularPrice - product.discountedPrice} />
              </span>{" "}
              upon purchase
            </p>
          )}

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
