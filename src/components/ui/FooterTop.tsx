import Image from "next/image"
import Container from "./Container"

const FooterTop = () => {
  // These would typically be imported from your assets
  // For this example, I'll use placeholder images
  const homeIcon = "/placeholder.svg?height=48&width=48"
  const tagIcon = "/placeholder.svg?height=48&width=48"
  const saveIcon = "/placeholder.svg?height=48&width=48"
  const smileIcon = "/placeholder.svg?height=48&width=48"

  const footers = [
    {
      image: homeIcon,
      title: "High Quality Selection",
      subTitle: "Total Product Quality Control For Peace Of Mind",
    },
    {
      image: tagIcon,
      title: "Affordable Prices",
      subTitle: "Factory Direct Prices For Maximum Savings",
    },
    {
      image: saveIcon,
      title: "Express Shipping",
      subTitle: "Fast, Reliable Delivery From Global Warehouses",
    },
    {
      image: smileIcon,
      title: "Worry Free",
      subTitle: "Instant Access To Professional Support",
    },
  ]

  return (
    <div className="bg-[#f7f7f7]">
      <Container className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {footers?.map((item, index) => (
          <div
            key={item?.title}
            className={`flex items-start gap-3 mr-6 ${
              index !== footers.length - 1 ? "lg:border-r border-gray-300" : ""
            }`}
          >
            <div className="relative w-12 h-12">
              <Image src={item?.image || "/placeholder.svg"} alt={item.title} fill className="object-contain" />
            </div>
            <div>
              <h3 className="text-lg font-bold">{item?.title}</h3>
              <p className="text-sm text-gray-600 pr-6">{item?.subTitle}</p>
            </div>
          </div>
        ))}
      </Container>
    </div>
  )
}

export default FooterTop
