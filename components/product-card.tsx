"use client"

import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ProductCardProps {
  name: string
  price: number
  originalPrice?: number
  image: string
  tag?: "hit" | "new" | "sale"
  flowers?: string
  href?: string
}

export function ProductCard({
  name,
  price,
  originalPrice,
  image,
  tag,
  flowers,
  href,
}: ProductCardProps) {
  const content = (
    <>
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-muted">
        <Image
          src={image || "/placeholder.svg"}
          alt={name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Tag */}
        {tag && (
          <span
            className={cn(
              "absolute top-3 left-3 px-2.5 py-1 text-[10px] uppercase tracking-wider rounded-full font-medium",
              tag === "hit" && "bg-primary text-primary-foreground",
              tag === "new" && "bg-foreground text-background",
              tag === "sale" && "bg-[#c9a9a9] text-white"
            )}
          >
            {tag}
          </span>
        )}

        {/* Quick actions overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        
        {/* Action buttons */}
        <div className="absolute bottom-3 left-3 right-3 flex gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <Button
            variant="secondary"
            className="flex-1 bg-white/95 hover:bg-white text-foreground rounded-full text-xs h-9"
          >
            <ShoppingBag className="h-3.5 w-3.5 mr-1.5" />
            Add to Cart
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="bg-white/95 hover:bg-white text-foreground rounded-full h-9 w-9"
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Product info */}
      <div className="mt-4 space-y-1">
        {flowers && (
          <p className="text-xs text-muted-foreground line-clamp-1">
            {flowers}
          </p>
        )}
        <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
          {name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-foreground font-medium">
            {price.toLocaleString()} ₽
          </span>
          {originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {originalPrice.toLocaleString()} ₽
            </span>
          )}
        </div>
      </div>
    </>
  )

  if (href) {
    return (
      <Link href={href} className="group block">
        {content}
      </Link>
    )
  }

  return <div className="group">{content}</div>
}
