'use client'

import type React from "react"
import { Toaster } from "@/components/ui/toaster"

export default function SignInLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      {children}
      <Toaster />
    </>
  )
}