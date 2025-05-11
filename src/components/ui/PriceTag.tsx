interface PriceTagProps {
  regularPrice?: number
  discountedPrice?: number
}

const PriceTag = ({ regularPrice, discountedPrice }: PriceTagProps) => {
  return (
    <div className="flex items-center gap-2">
      {discountedPrice && <p className="text-lg font-bold text-red-600">{discountedPrice}DA</p>}
      {regularPrice && (
        <p className={`text-base font-medium ${discountedPrice ? "line-through text-gray-500" : "text-black"}`}>
          {regularPrice}DA
        </p>
      )}
    </div>
  )
}

export default PriceTag
