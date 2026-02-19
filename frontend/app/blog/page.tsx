import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { articles } from "@/lib/blog-data"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Блог | Цветочек в Горшочек",
  description: "Статьи о премиальных розах, интерьерном озеленении и необычных растениях. Букеты с доставкой по Москве.",
}

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="pt-14 lg:pt-[104px] pb-16 md:pb-24 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
        <h1 className="font-serif text-2xl md:text-3xl text-foreground">
          Блог
        </h1>
        <p className="mt-4 text-muted-foreground">
          Статьи о коллекциях, сезонах и идеях для подарков.
        </p>

        <div className="mt-12 space-y-16">
          {articles.map((article) => (
            <article
              key={article.id}
              id={article.id}
              className="scroll-mt-24"
            >
              <div className="grid md:grid-cols-2 gap-8 items-start">
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col h-full">
                  <h2 className="font-serif text-xl md:text-2xl text-foreground mb-4">
                    {article.title}
                  </h2>
                  <div className="text-muted-foreground leading-relaxed flex-grow">
                    {article.content}
                  </div>
                  <div className="mt-8">
                    <Button asChild className="w-full sm:w-auto">
                      <Link href={article.ctaLink}>
                        {article.ctaText}
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/catalog"
            className="text-primary hover:underline font-medium"
          >
            Смотреть весь каталог букетов
          </Link>
        </div>
      </section>
    </main>
  )
}
