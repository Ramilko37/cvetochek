"use client"

import { Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Пример данных (реальные отзывы скопируйте с Яндекса)
// Ссылки на отзывы можно брать конкретные, если Яндекс позволяет, или просто на список отзывов
const YANDEX_REVIEWS_URL = "https://yandex.ru/maps/org/tsvetochek_v_gorshochek/148240490055/reviews/?display-text=%D1%86%D0%B2%D0%B5%D1%82%D0%BE%D1%87%D0%B5%D0%BA%20%D0%B2%20%D0%B3%D0%BE%D1%80%D1%88%D0%BE%D1%87%D0%B5%D0%BA&ll=37.893180%2C55.748319&mode=search&sctx=ZAAAAAgBEAAaKAoSCTHQtS%2BgkUJAEQ%2FQfTmz50tAEhIJ%2FMitSbclqj8RpMSu7e2WlD8iBgABAgMEBSgKOABAmoIGSAFqAnJ1nQHNzMw9oAEAqAEAvQHENf7zwgGSAce8yZ6oBMKhtuHrAczqt7GABJeI%2BvWPAr787MWoA83bmPLFBaKq4ZFe%2Fc7GndQF86Cz%2BO8BhMiLjLACyf%2FRvgbQvILWBa%2FPj7m9AbHW%2FrjbBuWvtOSJBa%2FOu%2F2oBuHs%2BviDAZyaxqaPBZyIieK1BefOr6m%2FBYeNjerSBYr85rODAZ7jvJ7DAqLAq5K1BvXS650SggIk0YbQstC10YLQvtGH0LXQuiDQsiDQs9C%2B0YDRiNC%2B0YfQtdC6igIAkgIAmgIMZGVza3RvcC1tYXBz&sll=37.761344%2C55.748319&sspn=0.817108%2C0.322224&tab=reviews&text=%D1%86%D0%B2%D0%B5%D1%82%D0%BE%D1%87%D0%B5%D0%BA%20%D0%B2%20%D0%B3%D0%BE%D1%80%D1%88%D0%BE%D1%87%D0%B5%D0%BA&utm_source=share&z=11"

const REVIEWS = [
  {
    id: 1,
    author: "Анна С.",
    rating: 5,
    text: "Потрясающий букет! Цветы свежие, стояли почти две недели. Доставка точно ко времени.",
    date: "12 февраля 2024",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    id: 2,
    author: "Михаил",
    rating: 5,
    text: "Заказывал жене на годовщину. Собрали очень стильную композицию, не колхоз. Спасибо!",
    date: "10 февраля 2024",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    id: 3,
    author: "Елена В.",
    rating: 5,
    text: "Очень вежливые флористы, помогли подобрать цветы под бюджет. Рекомендую!",
    date: "05 февраля 2024",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg"
  },
  {
    id: 4,
    author: "Дмитрий К.",
    rating: 5,
    text: "Отличный сервис, букет полностью соответствовал фото на сайте. Жена в восторге!",
    date: "01 февраля 2024",
    avatar: "https://randomuser.me/api/portraits/men/86.jpg"
  },
  {
    id: 5,
    author: "Ольга М.",
    rating: 5,
    text: "Заказываю здесь уже не первый раз. Всегда свежие цветы и красивые композиции.",
    date: "28 января 2024",
    avatar: "https://randomuser.me/api/portraits/women/12.jpg"
  },
]

export function ReviewsMarquee() {
  return (
    <div className="w-full overflow-hidden bg-muted/30 py-4 border-t border-border/50">
      <div className="flex overflow-hidden group gap-4">
        {/* Первый набор карточек */}
        <div className="animate-marquee flex shrink-0 gap-4 items-center group-hover:[animation-play-state:paused]">
          {REVIEWS.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>

        {/* Дублирующий набор для бесшовности (aria-hidden) */}
        <div className="animate-marquee flex shrink-0 gap-4 items-center group-hover:[animation-play-state:paused]" aria-hidden="true">
          {REVIEWS.map((review) => (
            <ReviewCard key={`clone-${review.id}`} review={review} />
          ))}
        </div>
      </div>
    </div>
  )
}

function ReviewCard({ review }: { review: typeof REVIEWS[0] }) {
  return (
    <a
      href={YANDEX_REVIEWS_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="w-[280px] shrink-0 rounded-xl border border-border/50 bg-background p-4 shadow-sm whitespace-normal transition-all hover:border-primary/50 hover:shadow-md cursor-pointer block no-underline"
      title="Открыть отзывы на Яндекс.Картах"
    >
      <div className="flex items-center gap-3 mb-3">
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarImage src={review.avatar} alt={review.author} />
          <AvatarFallback>{review.author[0]}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-medium text-sm leading-none text-foreground">{review.author}</span>
          <span className="text-[10px] text-muted-foreground mt-1">{review.date}</span>
        </div>
      </div>
      
      <div className="flex gap-0.5 mb-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              "h-3 w-3",
              i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"
            )}
          />
        ))}
      </div>
      <p className="text-sm text-muted-foreground line-clamp-3 leading-snug">
        {review.text}
      </p>
    </a>
  )
}
