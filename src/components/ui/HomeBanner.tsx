import Container from "./Container"
import LinkButton from "./LinkButton"
import Image from "next/image"

const HomeBanner = () => {
  return (
    <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden">
      <Image src="/images/homeBanner.jpg" alt="test" fill className="object-cover" priority  />
      <div className="absolute inset-0  bg-opacity-50">
        <Container className="h-full flex flex-col justify-center gap-6 text-white">
          <h2 className="text-4xl md:text-6xl font-bold">Mi Air Purifier</h2>
          <p className="text-lg font-semibold max-w-[350px]">
            The new tech gift you are wishing for right here. Clean air for a healthier home.
          </p>
          <LinkButton className="w-44 flex items-center justify-center bg-white text-darkText hover:bg-darkText hover:text-white duration-200" />
        </Container>
      </div>
    </div>
  )
}

export default HomeBanner
