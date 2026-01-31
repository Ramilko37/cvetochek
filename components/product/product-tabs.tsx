"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Product } from "@/types/product"

interface ProductTabsProps {
  product: Product
}

export function ProductTabs({ product }: ProductTabsProps) {
  return (
    <Tabs defaultValue="description" className="w-full">
      <TabsList className="w-full justify-start rounded-2xl bg-secondary/80 border border-border p-2 h-auto flex-wrap gap-2 min-h-12">
        <TabsTrigger
          value="description"
          className="rounded-xl px-5 py-2.5 text-base font-medium transition-all duration-300 ease-out data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
        >
          Описание
        </TabsTrigger>
        <TabsTrigger
          value="composition"
          className="rounded-xl px-5 py-2.5 text-base font-medium transition-all duration-300 ease-out data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
        >
          Состав
        </TabsTrigger>
        <TabsTrigger
          value="delivery"
          className="rounded-xl px-5 py-2.5 text-base font-medium transition-all duration-300 ease-out data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
        >
          Доставка
        </TabsTrigger>
        <TabsTrigger
          value="care"
          className="rounded-xl px-5 py-2.5 text-base font-medium transition-all duration-300 ease-out data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
        >
          Уход
        </TabsTrigger>
      </TabsList>

      <TabsContent value="description" className="mt-4 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:duration-300">
        <div className="prose prose-sm max-w-none text-foreground">
          {product.description.split("\n\n").map((paragraph, i) => (
            <p key={i} className="text-muted-foreground mb-4 last:mb-0">
              {paragraph}
            </p>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="composition" className="mt-4 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:duration-300">
        <dl className="space-y-3 text-sm">
          <div>
            <dt className="text-muted-foreground">Цветы</dt>
            <dd className="font-medium text-foreground">
              {product.composition.flowers.join(", ")}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Упаковка</dt>
            <dd className="font-medium text-foreground">
              {product.composition.packaging.join(", ")}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Высота</dt>
            <dd className="font-medium text-foreground">
              {product.composition.height}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Диаметр</dt>
            <dd className="font-medium text-foreground">
              {product.composition.diameter}
            </dd>
          </div>
        </dl>
      </TabsContent>

      <TabsContent value="delivery" className="mt-4 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:duration-300">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 font-medium text-foreground">
                  Интервал
                </th>
                <th className="text-left py-3 font-medium text-foreground">
                  Москва
                </th>
                {product.delivery.intervals[0]?.outsideMkad && (
                  <th className="text-left py-3 font-medium text-foreground">
                    За МКАД
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {product.delivery.intervals.map((row) => (
                <tr key={row.label} className="border-b border-border/50">
                  <td className="py-3 text-muted-foreground">{row.label}</td>
                  <td className="py-3 text-foreground">{row.moscow}</td>
                  {row.outsideMkad && (
                    <td className="py-3 text-foreground">{row.outsideMkad}</td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TabsContent>

      <TabsContent value="care" className="mt-4 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:duration-300">
        <p className="text-sm text-muted-foreground whitespace-pre-line">
          {product.careInstructions}
        </p>
      </TabsContent>
    </Tabs>
  )
}
