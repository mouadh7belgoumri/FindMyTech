import Container from "@/components/ui/Container"
import Link from "next/link"
import { XCircle } from "lucide-react"

export default function CancelPage() {
  return (
    <Container>
      <div className="flex flex-col items-center justify-center py-10">
        <XCircle className="w-20 h-20 text-red-500 mb-6" />
        <h1 className="text-3xl font-bold">Order Cancelled</h1>
        <p className="text-lg text-gray-600 mt-4 mb-8 text-center max-w-md">
          Your order has been cancelled. If you have any questions, please contact our customer support.
        </p>
        <Link href="/product">
          <button className="bg-gray-800 text-gray-200 px-8 py-4 rounded-md hover:bg-black hover:text-white duration-200 uppercase text-sm font-semibold tracking-wide">
            Return to Shop
          </button>
        </Link>
      </div>
    </Container>
  )
}
