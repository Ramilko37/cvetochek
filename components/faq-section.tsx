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

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="py-16 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <h2 className="font-serif text-2xl md:text-3xl text-foreground">
          Флористика и уход
        </h2>
        <Link 
          href="#" 
          className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
        >
          Смотреть все
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* FAQ list */}
      <div className="space-y-2">
        {faqs.map((faq, index) => (
          <div 
            key={faq.question}
            className="border border-border rounded-2xl overflow-hidden"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex items-center justify-between p-5 text-left hover:bg-secondary/50 transition-colors"
            >
              <span className="font-medium text-foreground pr-4">
                {faq.question}
              </span>
              <ChevronDown 
                className={cn(
                  "h-5 w-5 text-muted-foreground flex-shrink-0 transition-transform",
                  openIndex === index && "rotate-180"
                )} 
              />
            </button>
            <div 
              className={cn(
                "overflow-hidden transition-all duration-300",
                openIndex === index ? "max-h-96" : "max-h-0"
              )}
            >
              <div className="px-5 pb-5 text-muted-foreground">
                {faq.answer}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
