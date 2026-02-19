"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { articles } from "@/lib/blog-data"

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
            className="group flex flex-col h-full"
          >
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-4 shrink-0">
              <Image
                src={article.image || "/placeholder.svg"}
                alt={article.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <h3 className="font-medium text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
              {article.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-3">
              {article.excerpt}
            </p>
          </Link>
        ))}
      </div>
    </section>
  )
}
