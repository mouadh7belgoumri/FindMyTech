"use client"

import { useState, useEffect } from "react"
import NextImage from "next/image"
import { resolveImagePath, imageExists } from "@/lib/image-utils"

interface ImageProps {
  src: string
  alt: string
  fill?: boolean
  width?: number
  height?: number
  className?: string
  priority?: boolean
}

export default function Image({ src, alt, fill, width, height, className, priority }: ImageProps) {
  const [imageSrc, setImageSrc] = useState<string>(src)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<boolean>(false)

  useEffect(() => {
    const checkImage = async () => {
      setLoading(true)
      setError(false)

      try {
        // Resolve the image path
        const resolvedSrc = resolveImagePath(src)

        // Check if the image exists
        const exists = await imageExists(resolvedSrc)

        if (exists) {
          setImageSrc(resolvedSrc)
        } else {
          // If the image doesn't exist, use a placeholder
          setImageSrc("/placeholder.svg")
          setError(true)
        }
      } catch (error) {
        console.error("Error checking image:", error)
        setImageSrc("/placeholder.svg")
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    checkImage()
  }, [src])

  if (loading) {
    return (
      <div className={`bg-gray-200 animate-pulse ${className}`} style={{ width, height }}>
        {!fill && <div style={{ paddingBottom: "100%" }} />}
      </div>
    )
  }

  if (fill) {
    return (
      <NextImage
        src={imageSrc}
        alt={alt}
        fill
        className={className}
        priority={priority}
        unoptimized={imageSrc.startsWith("http")}
        onError={() => {
          setImageSrc("/placeholder.svg")
          setError(true)
        }}
      />
    )
  }

  return (
    <NextImage
      src={imageSrc}
      alt={alt}
      width={width || 300}
      height={height || 300}
      className={className}
      priority={priority}
      unoptimized={imageSrc.startsWith("http")}
      onError={() => {
        setImageSrc("/placeholder.svg")
        setError(true)
      }}
    />
  )
}
