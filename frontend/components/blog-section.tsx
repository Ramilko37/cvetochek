"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { getImagePath } from "@/lib/utils"

const articles = [
  {
    id: "premium-roses",
    image: getImagePath("/images/cat-roses.webp"),
    title: "Премиальные розы: почему мы их так любим и какие сорта покоряют с первого взгляда?",
    excerpt: "Red Monster, Country Blues, Вегги — наши любимчики в мастерской",
  },
  {
    id: "urban-jungle",
    image: getImagePath("/images/cat-plants.webp"),
    title: "Городские джунгли: стильные крупные растения, которые преобразят ваш дом",
    excerpt: "Монстера, фикусы и другие фавориты интерьерных дизайнеров",
  },
  {
    id: "exotic-plants",
    image: getImagePath("/images/plants.webp"),
    title: "От райских птиц до средиземноморского уюта: необычные растения в горшках",
    excerpt: "Стрелиция, мирт, сансевиерия — растения, которые удивят гостей",
  },
]

export function BlogSection() {
  return (
    <section className="py-16 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <h2 className="font-serif text-2xl md:text-3xl text-foreground">
          Блог
        </h2>
        <Link 
          href="/blog" 
          className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
        >
          Все материалы
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Articles grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {articles.map((article) => (
          <Link 
            key={article.id} 
            href={`/blog#${article.id}`}
            className="group"
          >
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-4">
              <Image
                src={article.image || "/placeholder.svg"}
                alt={article.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <h3 className="font-medium text-foreground mb-2 group-hover:text-primary transition-colors">
              {article.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {article.excerpt}
            </p>
          </Link>
        ))}
      </div>
    </section>
  )
}
