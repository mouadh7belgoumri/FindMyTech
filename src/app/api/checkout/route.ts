import { NextResponse } from "next/server"
import Stripe from "stripe"

// Ensure you have STRIPE_SECRET_KEY in your environment variables
const stripeSecret = process.env.STRIPE_SECRET_KEY || ""

export async function POST(request: Request) {
  if (!stripeSecret) {
    return NextResponse.json({ error: "Stripe secret key is not configured" }, { status: 500 })
  }

  const stripe = new Stripe(stripeSecret, {
    apiVersion: "2022-11-15",
  })

  try {
    const body = await request.json()
    const { items, email } = body

    const extractingItems = items.map((item: any) => ({
      quantity: item.quantity,
      price_data: {
        currency: "usd",
        unit_amount: item.discountedPrice * 100,
        product_data: {
          name: item.name,
          description: item.description || "",
          images: item.images || [],
        },
      },
    }))

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: extractingItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cancel`,
      metadata: {
        email,
      },
    })

    return NextResponse.json({
      message: "Checkout session created",
      success: true,
      id: session.id,
    })
  } catch (error) {
    console.error("Stripe checkout error:", error)
    return NextResponse.json({ error: "An error occurred with the payment process" }, { status: 500 })
  }
}
