"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

export default function ProductList({ products = [] }) {
  const [productList, setProductList] = useState(products)

  useEffect(() => {
    setProductList(products)
  }, [products])

  return (
    <div className="product-list">
      {/* Your product list rendering logic */}
      {productList.map((product: any , index:number) => (
        <div key ={index+1} >
          <Link href={`/product/${product.id}`}>{product.name}</Link>
        </div>
      ))}
    </div>
  )
}
