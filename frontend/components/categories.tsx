"use client"

import { useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getImagePath } from "@/lib/utils"

const categories = [
  { name: "Пионы", image: getImagePath("/images/cat-peonies.jpg"), href: "/catalog" },
  { name: "Розы", image: getImagePath("/images/cat-roses.jpg"), href: "/catalog" },
  { name: "Букеты", image: getImagePath("/images/cat-bouquets.jpg"), href: "/catalog?category=bouquets" },
  { name: "Композиции", image: getImagePath("/images/cat-compositions.jpg"), href: "/catalog?category=compositions" },
  { name: "Корзины", image: getImagePath("/images/cat-baskets.jpg"), href: "/catalog?category=baskets" },
  { name: "Моно", image: getImagePath("/images/cat-mono.jpg"), href: "/catalog?category=mono" },
  { name: "Еловые ветви", image: getImagePath("/images/christmas-branches.jpg"), href: "/catalog?category=new-year" },
  { name: "Новый год", image: getImagePath("/images/cat-newyear.jpg"), href: "/catalog?category=new-year" },
]

export function Categories() {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 200
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  return (
    <section className="py-12 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-2xl md:text-3xl text-foreground">
          Категории
        </h2>
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
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {categories.map((category) => (
          <Link
            key={category.name}
            href={category.href}
            className="flex-shrink-0 group block text-left"
          >
            <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-2xl overflow-hidden bg-muted">
              <Image
                src={category.image || "/placeholder.svg"}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <p className="mt-3 text-sm text-center text-foreground group-hover:text-primary transition-colors">
              {category.name}
            </p>
          </Link>
        ))}
      </div>
    </section>
  )
}
