import { ProductCard } from "@/components/product-card"
import { mockProducts } from "@/lib/mock-products"

export default function CatalogPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="pt-24 pb-16 md:pt-28 md:pb-24 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Заголовок */}
        <div className="mb-10">
          <h1 className="font-serif text-3xl md:text-4xl text-foreground text-balance">
            Все товары
          </h1>
          <p className="mt-2 text-muted-foreground text-sm md:text-base">
            {mockProducts.length} позиций в каталоге
          </p>
        </div>

        {/* Сетка карточек */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {mockProducts.map((product) => (
            <ProductCard
              key={product.id}
              name={product.name}
              price={product.price}
              originalPrice={product.originalPrice}
              image={product.images[0] ?? "/placeholder.svg"}
              flowers={product.composition.flowers.join(", ")}
              tag={
                product.originalPrice != null && product.originalPrice > product.price
                  ? "sale"
                  : undefined
              }
              href={`/item/${product.slug}`}
            />
          ))}
        </div>
      </section>
    </main>
  )
}
