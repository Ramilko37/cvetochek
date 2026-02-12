"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowUp } from "lucide-react"

const footerLinks = {
  "Контакты": [
    { name: "Cveto4ek_v_gorsho4ek@list.ru", href: "mailto:Cveto4ek_v_gorsho4ek@list.ru" },
    { name: "+7 926 470 55 45", href: "tel:+79264705545" },
    { name: "Москва", href: "/contacts" },
  ],
  "О магазине": [
    { name: "Блог", href: "/blog" },
    { name: "Вопросы и ответы", href: "/faq" },
    { name: "Карта сайта", href: "/sitemap" },
  ],
  "Доставка": [
    { name: "Оплата", href: "/payment" },
    { name: "Программа лояльности", href: "/loyalty" },
    { name: "Корпоративным клиентам", href: "/corporate" },
    { name: "Возврат", href: "/return" },
  ],
  "Флористика и уход": [
    { name: "Инструкция по свежести", href: "/care" },
    { name: "Вакансии", href: "/jobs" },
    { name: "Юр. информация", href: "/legal" },
    { name: "Публичная оферта", href: "/offer" },
  ],
}

const socialLinks: { name: string; href: string; ariaLabel?: string }[] = [
  { name: "VK", href: "https://vk.com/club229462676", ariaLabel: "ВКонтакте" },
  { name: "Inst", href: "https://instagram.com/cveto4ek_v_gorsho4ek", ariaLabel: "Instagram" },
  { name: "TG", href: "https://t.me/cvetoc4ek_v_gorsho4ek", ariaLabel: "Telegram" },
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
          <p className="text-sm text-muted-foreground">
            © 2015-2026, Цветочек в Горшочек
          </p>

          <div className="flex items-center gap-6">
            {/* Social links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.ariaLabel || social.name}
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
