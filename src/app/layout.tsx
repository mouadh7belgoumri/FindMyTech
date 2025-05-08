import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.scss"
import { Toaster } from "react-hot-toast"
import Header from "@/components/ui/Header"
import Footer from "@/components/ui/Footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "E-commerce Store",
  description: "Next.js E-commerce Application",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main>{children}</main>
        <Footer />
        <Toaster
          position="bottom-right"
          reverseOrder={false}
          gutter={8}
          containerClassName=""
          toastOptions={{
            style: {
              backgroundColor: "black",
              color: "white",
            },
          }}
        />
      </body>
    </html>
  )
}
