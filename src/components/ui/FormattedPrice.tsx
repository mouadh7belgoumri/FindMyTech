const FormattedPrice = ({ amount }: { amount?: number }) => {
  const formattedAmount = new Number(amount).toLocaleString("fr-DZ", {
    style: "currency",
    currency: "DZD",
    minimumFractionDigits: 2,
  })
  return <span>{formattedAmount}</span>
}

export default FormattedPrice
