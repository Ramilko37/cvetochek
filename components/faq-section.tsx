"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

const faqs = [
  {
    question: "А в «Букете недели» свежие цветы? Почему на него скидка?",
    answer: "Да, в «Букете недели» только свежие цветы! Скидка предоставляется потому, что мы закупаем эти цветы в большом объёме, что позволяет снизить стоимость. Это наш способ порадовать вас качественными букетами по приятной цене."
  },
  {
    question: "Почему букет невесты стоит так дорого?",
    answer: "Свадебный букет — это индивидуальная работа флориста, которая требует особого внимания к деталям, использования премиальных цветов и специальной техники сборки. Мы также учитываем стойкость букета на протяжении всего дня торжества."
  },
  {
    question: "Почему в моём букете короткие цветы в колбах?",
    answer: "Колбы с водой используются для того, чтобы цветы дольше оставались свежими во время доставки и после неё. Это особенно важно для нежных сортов, которые чувствительны к обезвоживанию."
  },
  {
    question: "Как ухаживать за букетом (композицией)?",
    answer: "Подрежьте стебли под углом, поставьте в чистую воду комнатной температуры. Меняйте воду каждые 2-3 дня, удаляйте увядшие листья. Избегайте прямых солнечных лучей и сквозняков."
  },
  {
    question: "Как долго я могу передвигаться с букетом по улице?",
    answer: "В тёплое время года букет может находиться без воды до 2-3 часов. Зимой рекомендуем ограничить время на улице до 15-20 минут, так как цветы чувствительны к морозу."
  },
  {
    question: "Можете ли вы передать букет на воде?",
    answer: "Да, мы можем оформить букет в вазе или с контейнером воды. Уточните этот момент при оформлении заказа, и мы подберём оптимальный вариант."
  },
  {
    question: "Могу ли я заменить цвет упаковки?",
    answer: "Конечно! При оформлении заказа вы можете указать предпочтительный цвет упаковки в комментарии, и наши флористы учтут ваши пожелания."
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
          {isFullPage ? "Вопрос-ответ" : "Флористика и уход"}
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
