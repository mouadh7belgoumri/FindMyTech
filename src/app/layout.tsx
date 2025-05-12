'use client'

import type React from "react"
import { Inter } from "next/font/google"
import "./globals.scss"
import { Toaster } from "react-hot-toast"
import Header from "@/components/ui/Header"
import Footer from "@/components/ui/Footer"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from "react"

const inter = Inter({ subsets: ["latin"] })

// Metadata moved to a separate file

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryClientProvider client={queryClient}>
          <main>{children}</main>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#333',
                color: '#fff',
              },
            }}
          />
        </QueryClientProvider>
      </body>
    </html>
  )
}
