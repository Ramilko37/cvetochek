import { readFile } from "node:fs/promises"
import path from "node:path"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Политика конфиденциальности | Цветочек в Горшочек",
  description:
    "Политика обработки персональных данных ИП Шалита П.В. для сайта cvetipolubvi.ru.",
}

async function loadPrivacyText(): Promise<string> {
  const filePath = path.join(process.cwd(), "public", "legal-docs", "privacy.txt")
  try {
    const raw = await readFile(filePath, "utf8")
    return raw.replace(/\r/g, "").trim()
  } catch {
    return "Документ политики конфиденциальности временно недоступен."
  }
}

export default async function PrivacyPage() {
  const privacyText = await loadPrivacyText()

  return (
    <main className="min-h-screen bg-background">
      <article className="pt-24 lg:pt-[132px] pb-16 md:pb-24 px-4 md:px-6 lg:px-8 max-w-4xl mx-auto">
        <h1 className="font-serif text-2xl md:text-3xl text-foreground">
          Политика конфиденциальности
        </h1>
        <p className="mt-4 text-muted-foreground">
          Политика Индивидуального предпринимателя Шалита П.В. в отношении обработки персональных данных.
        </p>

        <div className="mt-8 rounded-2xl border border-border bg-card p-5 md:p-7">
          <div className="whitespace-pre-wrap text-[15px] leading-7 text-foreground/90">
            {privacyText}
          </div>
        </div>
      </article>
    </main>
  )
}
