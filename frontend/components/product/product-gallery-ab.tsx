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

interface ProductGalleryAbProps {
  images: string[]
  name: string
}

export function ProductGalleryAb({ images, name }: ProductGalleryAbProps) {
  const [mainIndex, setMainIndex] = useState(0)
  const safeImages = images.length > 0 ? images : ["/placeholder.svg"]
  const goPrev = () => setMainIndex((i) => (i - 1 + safeImages.length) % safeImages.length)
  const goNext = () => setMainIndex((i) => (i + 1) % safeImages.length)

  return (
    <div className="space-y-4">
      <div className="relative aspect-square lg:aspect-auto lg:h-[min(56vh,620px)] rounded-3xl overflow-hidden bg-secondary/25 group">
        <Image
          src={safeImages[mainIndex]}
          alt={`${name} — фото ${mainIndex + 1}`}
          fill
          className="object-cover transition-opacity duration-300"
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
        />

        {safeImages.length > 1 && (
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

      <div className="px-2 sm:px-4 relative group/thumbs">
        <Carousel
          opts={{
            align: "start",
            dragFree: true,
          }}
          className="w-full"
        >
          <div className="[mask-image:linear-gradient(to_right,transparent,black_16px,black_calc(100%-16px),transparent)]">
            <CarouselContent className="-ml-2">
              {safeImages.map((src, index) => (
                <CarouselItem key={`${src}-${index}`} className="pl-2 basis-auto">
                  <button
                    type="button"
                    onClick={() => setMainIndex(index)}
                    className={cn(
                      "relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-xl overflow-hidden bg-secondary/30 transition-all duration-200",
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      mainIndex === index ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : "",
                    )}
                    aria-label={`Открыть фото ${index + 1}`}
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
          <CarouselPrevious className="-left-3 size-8 rounded-full bg-background/85 backdrop-blur-sm border-none shadow-sm hover:bg-background md:opacity-0 md:group-hover/thumbs:opacity-100 transition-opacity" />
          <CarouselNext className="-right-3 size-8 rounded-full bg-background/85 backdrop-blur-sm border-none shadow-sm hover:bg-background md:opacity-0 md:group-hover/thumbs:opacity-100 transition-opacity" />
        </Carousel>
      </div>
    </div>
  )
}
