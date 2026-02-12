"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { getImagePath } from "@/lib/utils"

export function CustomOrder() {
  return (
    <section className="py-16 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="relative rounded-3xl overflow-hidden bg-secondary">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Content */}
          <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground mb-2">
              Создадим букет
            </h2>
            <p className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground/80 italic mb-6">
              вашей мечты
            </p>
            <p className="text-muted-foreground text-lg mb-8 max-w-md">
              Не нашли подходящую композицию в каталоге? Есть референс или хотите передать определённое настроение? 
              Наша мастерская соберёт уникальный букет или подберёт растение по вашим пожеланиям и бюджету.
            </p>
            <div>
              <Button asChild className="rounded-full px-8 py-6 text-base">
                <Link href="/custom-order">
                  Заказать
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Image */}
          <div className="relative h-64 md:h-auto min-h-[300px]">
            <Image
              src={getImagePath("/images/cat-compositions.webp")}
              alt="Индивидуальный заказ"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
