"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

const faqs = [
  {
    question: "Можно ли доставить букет, зная только номер телефона получателя?",
    answer: "Да! Мы сами деликатно свяжемся с получателем, уточним удобное время и адрес доставки. При этом мы можем сохранить сюрприз и не говорить, что именно везем."
  },
  {
    question: "Будет ли букет точно таким же, как на фото?",
    answer: "Цветы — живой организм, поэтому двух абсолютно идентичных букетов не бывает. Кроме того, цветы имеют сезонность. Если какого-то цветка нет в наличии, мы свяжемся с вами и предложим равноценную замену, сохранив стиль, цветовую гамму и бюджет композиции."
  },
  {
    question: "Как продлить жизнь букету?",
    answer: "К каждому заказу мы прилагаем пакетик со специальной подкормкой (кризалом) и инструкцию по уходу. Главное правило: подрезайте стебли перед постановкой в вазу и меняйте воду периодически."
  },
  {
    question: "Возможна ли анонимная доставка?",
    answer: "Конечно. Просто укажите это при оформлении заказа, и курьер передаст цветы, не раскрывая вашего имени."
  },
]

type FaqSectionProps = {
  /** На полной странице /faq — заголовок «Вопрос-ответ», без ссылки «Смотреть все» */
  isFullPage?: boolean
}

export function FaqSection({ isFullPage }: FaqSectionProps = {}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const Heading = isFullPage ? "h1" : "h2"

  return (
    <section className="py-16 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <Heading className="font-serif text-2xl md:text-3xl text-foreground">
          { "Вопрос-ответ"}
        </Heading>
        {!isFullPage && (
          <Link 
            href="/faq" 
            className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
          >
            Смотреть все
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>

      {/* FAQ list */}
      <div className="space-y-2">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index
          return (
            <div 
              key={faq.question}
              className={cn(
                "border border-border rounded-2xl overflow-hidden bg-secondary transition-colors duration-300",
                isOpen && "ring-1 ring-primary/20"
              )}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-black/[0.03] transition-colors rounded-2xl"
              >
                <span className="font-medium text-foreground pr-4">
                  {faq.question}
                </span>
                <ChevronDown 
                  className={cn(
                    "h-5 w-5 flex-shrink-0 transition-all duration-300",
                    isOpen ? "rotate-180 text-primary" : "text-muted-foreground"
                  )} 
                />
              </button>
              <div 
                className={cn(
                  "overflow-hidden transition-all duration-300",
                  isOpen ? "max-h-96" : "max-h-0"
                )}
              >
                <div className="px-5 pb-5 text-muted-foreground">
                  {faq.answer}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
