"use client"

import { useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { getImagePath } from "@/lib/utils"

const slides = [
  {
    image: getImagePath("/images/hero-peonies.jpg"),
    label: "Новая коллекция",
    title: "Зимние",
    titleAccent: "букеты",
    description: "Свежие цветы с доставкой по Москве",
    buttonHref: "/catalog",
  },
  {
    image: getImagePath("/images/bouquet-week.jpg"),
    label: "Акция недели",
    title: "Скидка",
    titleAccent: "20%",
    description: "На все букеты из роз",
    buttonHref: "/catalog",
  },
  {
    image: getImagePath("/images/cat-roses.jpg"),
    label: "14 февраля",
    title: "День",
    titleAccent: "святого Валентина",
    description: "Букеты и композиции для самых близких",
    buttonHref: "/catalog",
  },
]

export function HeroSlider() {
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
    <section className="relative h-[70vh] min-h-[500px] max-h-[700px] overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.title}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <Image
            src={slide.image || "/placeholder.svg"}
            alt={slide.title}
            fill
            className="object-cover"
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />
          
          {/* Content — фиксированная высота блока текста, чтобы кнопка не скакала при смене слайда */}
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
              <div className="max-w-xl">
                <div className="min-h-[220px] md:min-h-[260px]">
                  <p className="text-white/70 text-xs uppercase tracking-[0.2em] mb-4">
                    {slide.label}
                  </p>
                  <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-white mb-2 leading-tight">
                    {slide.title}
                  </h1>
                  <p className="font-serif text-5xl md:text-6xl lg:text-7xl text-white/90 italic mb-6">
                    {slide.titleAccent}
                  </p>
                  <p className="text-white/80 text-lg mb-8">
                    {slide.description}
                  </p>
                </div>
                <Button 
                  asChild
                  className="rounded-full px-8 py-6 text-base bg-white text-foreground hover:bg-white/90 shrink-0"
                >
                  <a href={slide.buttonHref}>Выбрать букет</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation arrows */}
      <button
        type="button"
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
        aria-label="Предыдущий слайд"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        type="button"
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
        aria-label="Следующий слайд"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dots indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            type="button"
            key={`dot-${index}`}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentSlide 
                ? "bg-white w-8" 
                : "bg-white/40 w-2 hover:bg-white/60"
            }`}
            aria-label={`Перейти к слайду ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
