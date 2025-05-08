interface TitleProps {
  text: string
  className?: string
}

const Title = ({ text, className = "" }: TitleProps) => {
  return <h2 className={`text-2xl font-bold ${className}`}>{text}</h2>
}

export default Title
