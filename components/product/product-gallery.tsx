"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

interface ProductGalleryProps {
  images: string[]
  name: string
}

export function ProductGallery({ images, name }: ProductGalleryProps) {
  const [mainIndex, setMainIndex] = useState(0)

  const goPrev = () => setMainIndex((i) => (i - 1 + images.length) % images.length)
  const goNext = () => setMainIndex((i) => (i + 1) % images.length)

  return (
    <div className="space-y-4">
      {/* Main image + arrows */}
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-secondary/30 group">
        <Image
          src={images[mainIndex] ?? images[0]}
          alt={`${name} — фото ${mainIndex + 1}`}
          fill
          className="object-cover transition-opacity duration-300"
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
        />

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-background/95 transition-opacity md:opacity-0 md:group-hover:opacity-100"
              aria-label="Предыдущее фото"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={goNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-background/95 transition-opacity md:opacity-0 md:group-hover:opacity-100"
              aria-label="Следующее фото"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {/* Миниатюры — карусель */}
      <div className="px-4 relative group/thumbs">
        <Carousel
          opts={{
            align: "start",
            dragFree: true,
          }}
          className="w-full"
        >
          <div className="[mask-image:linear-gradient(to_right,transparent,black_20px,black_calc(100%-20px),transparent)]">
            <CarouselContent className="-ml-2">
              {images.map((src, index) => (
                <CarouselItem key={src} className="pl-2 basis-auto">
                  <button
                    type="button"
                    onClick={() => setMainIndex(index)}
                    className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-xl overflow-hidden bg-secondary/30 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Image
                      src={src}
                      alt={`${name} — миниатюра ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                </CarouselItem>
              ))}
            </CarouselContent>
          </div>
          <CarouselPrevious className="-left-4 size-8 rounded-full bg-background/80 backdrop-blur-sm border-none shadow-sm hover:bg-background/95 md:opacity-0 md:group-hover/thumbs:opacity-100 transition-opacity" />
          <CarouselNext className="-right-4 size-8 rounded-full bg-background/80 backdrop-blur-sm border-none shadow-sm hover:bg-background/95 md:opacity-0 md:group-hover/thumbs:opacity-100 transition-opacity" />
        </Carousel>
      </div>
    </div>
  )
}
