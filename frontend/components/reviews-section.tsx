"use client"

import Image from "next/image"
import { Star, ExternalLink } from "lucide-react"
import { cn, getImagePath } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const REVIEWS = [
  {
    id: 1,
    author: "Анна С.",
    source: "Яндекс.Карты",
    rating: 5,
    text: "Потрясающий букет! Цветы свежие, стояли почти две недели. Доставка точно ко времени. Очень порадовала упаковка и забота о клиенте.",
    date: "2024-02-12",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    customerPhotos: ["/images/product-1.webp"]
  },
  {
    id: 2,
    author: "Михаил",
    source: "Яндекс.Карты",
    rating: 5,
    text: "Заказывал жене на годовщину. Собрали очень стильную композицию, не колхоз. Жена в полном восторге, обязательно вернусь еще раз!",
    date: "2024-02-10",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    customerPhotos: ["/images/product-2.webp"]
  },
  {
    id: 3,
    author: "Елена В.",
    source: "Яндекс.Карты",
    rating: 5,
    text: "Очень вежливые флористы, помогли подобрать цветы под бюджет. Рекомендую этот магазин всем знакомым.",
    date: "2024-02-05",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    customerPhotos: ["/images/product-4.webp"]
  },
]

const ORGANIZATION_RATING = {
  value: 4.9,
  count: 65,
  yandexUrl: "https://yandex.ru/maps/-/CPQbn4-K"
}

export function ReviewsSection() {
  return (
    <section className="py-16 bg-muted/20">
      {/* SEO Разметка JSON-LD для ПС */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Florist",
            "name": "Цветочек в Горшочек",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": ORGANIZATION_RATING.value.toString(),
              "reviewCount": ORGANIZATION_RATING.count.toString(),
              "bestRating": "5",
              "worstRating": "1"
            },
            "review": REVIEWS.map(r => ({
              "@type": "Review",
              "author": { "@type": "Person", "name": r.author },
              "datePublished": r.date,
              "reviewBody": r.text,
              "reviewRating": {
                "@type": "Rating",
                "ratingValue": r.rating.toString(),
                "bestRating": "5",
                "worstRating": "1"
              }
            }))
          })
        }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <h2 className="text-3xl font-serif text-foreground mb-4">
              Нам доверяют свои эмоции
            </h2>
            <div className="flex items-center gap-3 bg-background border border-border/50 rounded-full px-4 py-2 w-fit shadow-sm">
              <span className="font-bold text-lg">{ORGANIZATION_RATING.value}</span>
              <div className="flex gap-0.5 text-yellow-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <a 
                href={ORGANIZATION_RATING.yandexUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-foreground hover:text-primary hover:underline ml-2 flex items-center gap-1"
              >
                на основе отзывов в Яндекс
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Скроллящаяся лента отзывов */}
        <div className="w-full overflow-hidden mt-8 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 pb-4 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="flex overflow-hidden group gap-6">
            {/* Первый набор карточек */}
            <div className="animate-marquee flex shrink-0 gap-6 items-stretch group-hover:[animation-play-state:paused]">
              {REVIEWS.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>

            {/* Дублирующий набор для бесшовности */}
            <div className="animate-marquee flex shrink-0 gap-6 items-stretch group-hover:[animation-play-state:paused]" aria-hidden="true">
              {REVIEWS.map((review) => (
                <ReviewCard key={`clone-${review.id}`} review={review} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ReviewCard({ review }: { review: typeof REVIEWS[0] }) {
  return (
    <a
      href={ORGANIZATION_RATING.yandexUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="w-[320px] sm:w-[380px] shrink-0 bg-background border border-border/50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full whitespace-normal cursor-pointer block no-underline text-inherit"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={review.avatar} alt={review.author} />
            <AvatarFallback>{review.author[0]}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium text-foreground">{review.author}</div>
            <div className="text-xs text-muted-foreground">
              {new Date(review.date).toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })} • {review.source}
            </div>
          </div>
        </div>
        <div className="flex gap-0.5 shrink-0">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star 
              key={i} 
              className={cn(
                "h-4 w-4", 
                i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"
              )} 
            />
          ))}
        </div>
      </div>
      
      <p className="text-muted-foreground text-sm mb-6 leading-relaxed flex-grow">
        {review.text}
      </p>

      {/* Блок с фото от клиента */}
      {review.customerPhotos && review.customerPhotos.length > 0 && (
        <div className="relative h-32 w-32 rounded-lg overflow-hidden border border-border/50 mt-auto shrink-0">
          <Image 
            src={getImagePath(review.customerPhotos[0])} 
            alt={`Фото заказа от ${review.author}`} 
            fill 
            className="object-cover" 
          />
        </div>
      )}
    </a>
  )
}
