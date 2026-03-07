"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useProductsContext } from "@/components/products-provider"
import { getCurrentOccasionsForProducts } from "@/lib/occasions"
import { cn } from "@/lib/utils"

export function Categories() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScroll, setCanScroll] = useState(false)
  const { products } = useProductsContext()
  const occasions = useMemo(() => getCurrentOccasionsForProducts(products), [products])
  const compactSet = occasions.length <= 2

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const checkScrollable = () => {
      setCanScroll(el.scrollWidth - el.clientWidth > 8)
    }

    checkScrollable()
    const resizeObserver = typeof ResizeObserver !== "undefined" ? new ResizeObserver(checkScrollable) : null
    resizeObserver?.observe(el)
    window.addEventListener("resize", checkScrollable)

    return () => {
      resizeObserver?.disconnect()
      window.removeEventListener("resize", checkScrollable)
    }
  }, [occasions.length])

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = Math.round(scrollRef.current.clientWidth * 0.75)
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  return (
    <section className="py-12 px-5 md:px-7 lg:px-10 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-2xl md:text-3xl text-foreground">
          Цветы по любому поводу
        </h2>
        {canScroll && occasions.length > 1 && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-9 w-9 bg-transparent"
              onClick={() => scroll("left")}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-9 w-9 bg-transparent"
              onClick={() => scroll("right")}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <div
        ref={scrollRef}
        className={cn(
          compactSet
            ? occasions.length === 1
              ? "grid grid-cols-1 gap-3 pb-4"
              : "grid grid-cols-1 md:grid-cols-2 gap-3 pb-4"
            : "flex gap-3 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4"
        )}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {occasions.map((occasion) => (
          <Link
            key={occasion.slug}
            href={occasion.href}
            className={cn(
              "group block cursor-pointer",
              compactSet ? "w-full min-w-0" : "flex-shrink-0 w-[280px] md:w-[320px]"
            )}
          >
            <div
              className={cn(
                "relative flex rounded-2xl overflow-hidden bg-accent transition-colors group-hover:bg-[#e5ddd5]",
                compactSet ? "h-[170px] md:h-[220px]" : "h-[140px] md:h-[160px]"
              )}
            >
              {/* Левая часть — текст */}
              <div className="flex flex-col justify-between p-5 md:p-6 min-w-0 flex-1">
                <p className="font-serif text-lg md:text-xl text-foreground leading-tight">
                  {occasion.name}
                </p>
                <span className="text-sm md:text-base text-foreground/80 font-medium inline-flex items-center gap-1.5 group-hover:text-primary transition-colors">
                  Смотреть
                  <ArrowRight className="h-4 w-4 shrink-0" />
                </span>
              </div>
              {/* Правая часть — изображение */}
              {occasion.image && (
                <div className="relative w-[48%] min-w-[120px] shrink-0">
                  <Image
                    src={occasion.image}
                    alt={occasion.name}
                    fill
                    className="object-cover object-center"
                  />
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
