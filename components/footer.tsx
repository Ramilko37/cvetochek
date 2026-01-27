"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowUp } from "lucide-react"

const footerLinks = {
  "Контакты": [
    { name: "info@cvetochek.ru", href: "mailto:info@cvetochek.ru" },
    { name: "8 (495) 120-77-22", href: "tel:+74951207722" },
    { name: "Москва", href: "#" },
  ],
  "О магазине": [
    { name: "Блог", href: "#" },
    { name: "Q&A", href: "#faq" },
    { name: "Приложение", href: "#app" },
    { name: "Карта сайта", href: "#" },
  ],
  "Доставка": [
    { name: "Оплата", href: "#" },
    { name: "Программа лояльности", href: "#" },
    { name: "Корпоративным клиентам", href: "#" },
    { name: "Возврат", href: "#" },
  ],
  "Флористика и уход": [
    { name: "Инструкция по свежести", href: "#" },
    { name: "Вакансии", href: "#" },
    { name: "Юр. информация", href: "#" },
    { name: "Публичная оферта", href: "#" },
  ],
}

const socialLinks = [
  { name: "VK", href: "#" },
  { name: "TG", href: "#" },
  { name: "Inst", href: "#" },
]

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <footer className="bg-secondary/50 border-t border-border">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-medium text-foreground mb-4">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <span className="font-serif text-foreground">Цветочек в Горшочек</span>
            <p className="text-sm text-muted-foreground">
              © 2015-2026, Цветочек в Горшочек
            </p>
          </div>

          <div className="flex items-center gap-6">
            {/* Social links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  className="w-9 h-9 rounded-full bg-foreground/10 flex items-center justify-center text-xs font-medium text-muted-foreground hover:bg-foreground hover:text-background transition-colors"
                >
                  {social.name}
                </Link>
              ))}
            </div>

            {/* Scroll to top */}
            <button
              type="button"
              onClick={scrollToTop}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Наверх
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
