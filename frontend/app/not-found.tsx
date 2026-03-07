import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background">
      <section className="pt-24 lg:pt-[132px] pb-16 md:pb-24 px-4 md:px-6 lg:px-8 max-w-3xl mx-auto text-center">
        <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">Ошибка 404</p>
        <h1 className="mt-4 font-serif text-4xl md:text-5xl text-foreground">
          Страница не найдена
        </h1>
        <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
          Похоже, ссылка устарела или страница была перемещена. Перейдите в каталог или вернитесь на главную.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button asChild className="rounded-full px-6">
            <Link href="/catalog">Перейти в каталог</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full px-6">
            <Link href="/">На главную</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}
