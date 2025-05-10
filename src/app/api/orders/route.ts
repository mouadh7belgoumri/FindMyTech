import { NextResponse } from "next/server"

// Mock orders data for fallback
const mockOrders = [
  {
    id: "1",
    order_number: "ORD-2023-001",
    date: "2023-05-15T10:30:00Z",
    status: "Completed",
    total: 349.98,
    items: [
      {
        product_id: "1",
        product_name: "Sony WH-1000XM4 Wireless Headphones",
        quantity: 1,
        price: 299.99,
        image: "/images/bannerOne.webp",
      },
      {
        product_id: "3",
        product_name: "Xiaomi 10000mAh Power Bank",
        quantity: 1,
        price: 49.99,
        image: "/images/bannerThree.webp",
      },
    ],
  },
  {
    id: "2",
    order_number: "ORD-2023-002",
    date: "2023-06-22T14:45:00Z",
    status: "Processing",
    total: 799.99,
    items: [
      {
        product_id: "5",
        product_name: "MSI GeForce RTX 3080 Gaming X Trio",
        quantity: 1,
        price: 799.99,
        image: "/images/cartegraphique.jpeg",
      },
    ],
  },
]

export async function GET() {
  // This is a fallback API route that returns mock data
  // when the PHP backend is not available
  return NextResponse.json({
    success: true,
    orders: mockOrders,
  })
}
