import { readFile } from "node:fs/promises"
import path from "node:path"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Публичная оферта | Цветочек в Горшочек",
  description: "Публичная оферта интернет-магазина Цветочек в Горшочек.",
}

async function loadOfferText(): Promise<string> {
  const filePath = path.join(process.cwd(), "public", "legal-docs", "offer.txt")
  try {
    const raw = await readFile(filePath, "utf8")
    return raw.replace(/\r/g, "").trim()
  } catch {
    return "Документ оферты временно недоступен."
  }
}

export default async function OfferPage() {
  const offerText = await loadOfferText()

  return (
    <main className="min-h-screen bg-background">
      <article className="pt-14 lg:pt-[104px] pb-16 md:pb-24 px-4 md:px-6 lg:px-8 max-w-4xl mx-auto">
        <h1 className="font-serif text-2xl md:text-3xl text-foreground">
          Публичная оферта
        </h1>
        <p className="mt-4 text-muted-foreground">
          Актуальная редакция документа интернет-магазина «Cvetipolubvi».
        </p>

        <div className="mt-8 rounded-2xl border border-border bg-card p-5 md:p-7">
          <div className="whitespace-pre-wrap text-[15px] leading-7 text-foreground/90">
            {offerText}
          </div>
        </div>

        <div className="mt-8">
          <Link href="/privacy" className="text-primary hover:underline font-medium">
            Политика конфиденциальности
          </Link>
        </div>
      </article>
    </main>
  )
}
