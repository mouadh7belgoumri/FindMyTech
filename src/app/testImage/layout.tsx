import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"

import { Toaster } from "react-hot-toast"
import Header from "@/components/ui/Header"
import Footer from "@/components/ui/Footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: "image test",
    description: "Next.js E-commerce Application",
    generator: 'v0.dev'
}

export default function ImageLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <>
            <h1>testlayout</h1>
            <h1>testlayout</h1>
            <div>{children}</div>

        </>
    )
}
