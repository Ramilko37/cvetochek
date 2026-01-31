"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProductGalleryProps {
  images: string[]
  name: string
}

export function ProductGallery({ images, name }: ProductGalleryProps) {
  const [mainIndex, setMainIndex] = useState(0)

  const goPrev = () => setMainIndex((i) => (i - 1 + images.length) % images.length)
  const goNext = () => setMainIndex((i) => (i + 1) % images.length)

  return (
    <div className="space-y-3">
      {/* Main image + arrows */}
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-transparent group">
        <Image
          src={images[mainIndex] ?? images[0]}
          alt={`${name} — фото ${mainIndex + 1}`}
          fill
          className="object-contain transition-opacity duration-300"
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
        />

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-background/95 transition-opacity md:opacity-0 md:group-hover:opacity-100"
              aria-label="Предыдущее фото"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={goNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-background/95 transition-opacity md:opacity-0 md:group-hover:opacity-100"
              aria-label="Следующее фото"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {/* Миниатюры — центрированы, ~70% ширины, overflow при скролле */}
      <div className="flex justify-center">
        <div
          className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide w-[70%] min-w-0"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
        {images.map((src, index) => (
          <button
            key={src}
            type="button"
            onClick={() => setMainIndex(index)}
            className={cn(
              "relative w-11 h-11 sm:w-12 sm:h-12 shrink-0 rounded-lg overflow-hidden bg-transparent ring-2 transition-all duration-200 hover:ring-primary/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              mainIndex === index ? "ring-primary" : "ring-transparent",
            )}
          >
            <Image
              src={src}
              alt={`${name} — миниатюра ${index + 1}`}
              fill
              className="object-cover"
              sizes="48px"
            />
          </button>
        ))}
        </div>
      </div>
    </div>
  )
}
