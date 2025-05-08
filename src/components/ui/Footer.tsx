import Image from "next/image"
import Container from "./Container"
import FooterTop from "./FooterTop"

const Footer = () => {
  // This would typically be imported from your assets
  const payment = "/placeholder.svg?height=40&width=200"

  return (
    <div className="mt-10">
      <FooterTop />
      <Container className="flex flex-col md:flex-row items-center gap-4 justify-between">
        <p>@{new Date().getFullYear()} E-commerce solutions. All rights reserved.</p>
        <div className="relative h-10 w-48">
          <Image src={payment || "/placeholder.svg"} alt="payment-img" fill className="object-contain" />
        </div>
      </Container>
    </div>
  )
}

export default Footer
