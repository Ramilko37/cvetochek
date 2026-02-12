"use client"

import Image from "next/image"
import Link from "next/link"
import { Mail, Phone, MessageCircle, Send, ArrowRight } from "lucide-react"
import { getImagePath } from "@/lib/utils"

export function ContactBlocks() {
  return (
    <section className="py-16 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid md:grid-cols-3 gap-6">
        {/* Contact info */}
        <div className="bg-secondary rounded-3xl p-8">
          <h3 className="font-serif text-2xl text-foreground mb-2">
            Связаться с нами
          </h3>
          <p className="text-muted-foreground mb-8">
            Свяжитесь с нами и дайте нам знать, чем мы можем помочь.
          </p>
          
          <div className="space-y-4">
            <Link 
              href="mailto:info@cvetochek.ru" 
              className="flex items-center gap-3 text-foreground hover:text-primary transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center">
                <Mail className="h-4 w-4" />
              </div>
              <span>info@cvetochek.ru</span>
            </Link>
            
            <Link 
              href="tel:+79264705545" 
              className="flex items-center gap-3 text-foreground hover:text-primary transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center">
                <Phone className="h-4 w-4" />
              </div>
              <span>+7 926 470 55 45</span>
            </Link>
            
            <Link 
              href="#" 
              className="flex items-center gap-3 text-foreground hover:text-primary transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center">
                <MessageCircle className="h-4 w-4" />
              </div>
              <span>WhatsApp</span>
            </Link>
            
            <Link 
              href="#" 
              className="flex items-center gap-3 text-foreground hover:text-primary transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center">
                <Send className="h-4 w-4" />
              </div>
              <span>Telegram</span>
            </Link>
          </div>
        </div>

        {/* Individual order card */}
        <Link href="#" className="group relative rounded-3xl overflow-hidden block">
          <div className="absolute inset-0">
            <Image
              src={getImagePath("/images/cat-compositions.webp")}
              alt="Индивидуальный заказ"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          </div>
          <div className="relative p-8 h-full min-h-[280px] flex flex-col justify-end">
            <h3 className="font-serif text-2xl text-white mb-2">
              Индивидуальный заказ цветов
            </h3>
            <p className="text-white/80 mb-4">
              Не нашли то, что искали? Создадим букет по вашим пожеланиям.
            </p>
            <span className="text-white flex items-center gap-2 text-sm font-medium group-hover:gap-3 transition-all">
              Заказать <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </Link>

        {/* Corporate card */}
        <Link href="#" className="group relative rounded-3xl overflow-hidden block">
          <div className="absolute inset-0">
            <Image
              src={getImagePath("/images/cat-baskets.webp")}
              alt="Корпоративным клиентам"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          </div>
          <div className="relative p-8 h-full min-h-[280px] flex flex-col justify-end">
            <h3 className="font-serif text-2xl text-white mb-2">
              Букеты корпоративным клиентам
            </h3>
            <p className="text-white/80 mb-4">
              Хотите сделать заказ для компании? Особые условия для бизнеса.
            </p>
            <span className="text-white flex items-center gap-2 text-sm font-medium group-hover:gap-3 transition-all">
              Подробнее <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </Link>
      </div>
    </section>
  )
}
