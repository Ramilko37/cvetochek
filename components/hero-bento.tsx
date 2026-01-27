"use client"

import { useState, useEffect, useCallback } from "react"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { getImagePath } from "@/lib/utils"

const slides = [
  {
    image: getImagePath("/images/hero-peonies.jpg"),
    label: "Новая коллекция",
    title: "Зимние",
    titleEm: "Букеты",
    buttonText: "Смотреть",
  },
  {
    image: getImagePath("/images/bouquet-week.jpg"),
    label: "Акция недели",
    title: "Скидка",
    titleEm: "20%",
    buttonText: "Выбрать букет",
  },
  {
    image: getImagePath("/images/christmas-branches.jpg"),
    label: "Новогоднее настроение",
    title: "Еловые",
    titleEm: "Композиции",
    buttonText: "Подробнее",
  },
]

export function HeroBento() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }, [])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }, [])

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000)
    return () => clearInterval(timer)
  }, [nextSlide])

  return (
    <section className="pt-24 pb-12 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[140px] md:auto-rows-[180px]">
        {/* Main hero card with carousel - spans 2 cols and 2 rows */}
        <div className="col-span-2 row-span-2 relative rounded-2xl overflow-hidden group bg-[#ebe4dd]">
          {slides.map((slide, index) => (
            <div
              key={slide.label}
              className={`absolute inset-0 transition-opacity duration-700 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={slide.image || "/placeholder.svg"}
                alt={slide.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority={index === 0}
              />
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          
          {/* Navigation arrows */}
          <button
            type="button"
            onClick={prevSlide}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors opacity-0 group-hover:opacity-100"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={nextSlide}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors opacity-0 group-hover:opacity-100"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <p className="text-white/80 text-xs uppercase tracking-widest mb-2">
              {slides[currentSlide].label}
            </p>
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white mb-4 leading-tight">
              {slides[currentSlide].title}<br />
              <em>{slides[currentSlide].titleEm}</em>
            </h1>
            <div className="flex items-center gap-4">
              <Button 
                variant="secondary" 
                className="bg-white/90 hover:bg-white text-foreground rounded-full px-6"
              >
                {slides[currentSlide].buttonText}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              {/* Dots indicator */}
              <div className="flex gap-1.5">
                {slides.map((_, index) => (
                  <button
                    type="button"
                    key={`dot-${index}`}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentSlide 
                        ? "bg-white w-6" 
                        : "bg-white/50 hover:bg-white/70"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Букет недели */}
        <div className="col-span-1 row-span-1 relative rounded-2xl overflow-hidden group bg-[#e8d4d4]">
          <Image
            src={getImagePath("/images/bouquet-week.jpg")}
            alt="Букет недели"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <p className="text-white/90 text-[10px] md:text-xs uppercase tracking-wider">
              Букет недели
            </p>
            <p className="font-serif text-white text-lg md:text-xl mt-1">
              от 4 990 ₽
            </p>
          </div>
        </div>

        {/* Корзины с цветами */}
        <div className="col-span-1 row-span-2 relative rounded-2xl overflow-hidden group bg-[#f0e6dc]">
          <Image
            src={getImagePath("/images/cat-baskets.jpg")}
            alt="Корзины с цветами"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
            <p className="text-white/80 text-[10px] md:text-xs uppercase tracking-wider mb-1">
              Подарок
            </p>
            <h3 className="font-serif text-white text-xl md:text-2xl">
              Корзины<br />с цветами
            </h3>
          </div>
        </div>

        {/* Доставка */}
        <div className="col-span-1 row-span-1 rounded-2xl bg-secondary p-4 md:p-5 flex flex-col justify-between">
          <div>
            <p className="text-[10px] md:text-xs uppercase tracking-wider text-muted-foreground">
              Экспресс
            </p>
            <p className="font-serif text-lg md:text-2xl text-foreground mt-1">
              120 мин<br />Доставка
            </p>
          </div>
          <p className="text-xs text-muted-foreground">Москва и СПб</p>
        </div>

        {/* Новогоднее */}
        <div className="col-span-1 row-span-1 relative rounded-2xl overflow-hidden group bg-[#dde4e8]">
          <Image
            src={getImagePath("/images/christmas-branches.jpg")}
            alt="Новогодние композиции"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <p className="text-white/90 text-[10px] md:text-xs uppercase tracking-wider">
              Новый год
            </p>
            <p className="font-serif text-white text-base md:text-lg mt-1">
              Еловые ветви
            </p>
          </div>
        </div>

        {/* Подписка */}
        <div className="col-span-1 row-span-1 relative rounded-2xl overflow-hidden group bg-[#e8dcd4]">
          <Image
            src={getImagePath("/images/subscription.jpg")}
            alt="Подписка на цветы"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <p className="text-white/90 text-[10px] md:text-xs uppercase tracking-wider">
              Подписка
            </p>
            <p className="font-serif text-white text-base md:text-lg mt-1">
              Цветы каждую неделю
            </p>
          </div>
        </div>

        {/* Акция */}
        <div className="col-span-1 row-span-1 rounded-2xl bg-primary p-4 md:p-5 flex flex-col justify-between text-primary-foreground">
          <p className="text-3xl md:text-4xl font-serif">-25%</p>
          <div>
            <p className="text-xs uppercase tracking-wider opacity-90">
              Букет недели
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
