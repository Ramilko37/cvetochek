"use client"

import { Checkbox } from "@/components/ui/checkbox"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Slider } from "@/components/ui/slider"
import { ChevronDown } from "lucide-react"
import type { CatalogFiltersState } from "./catalog-content"

export interface CatalogFacets {
  categories: { slug: string; name: string }[]
  occasions: { slug: string; name: string }[]
  flowers: string[]
  priceMin: number
  priceMax: number
}

interface CatalogFiltersProps {
  facets: CatalogFacets
  filters: CatalogFiltersState
  onFiltersChange: (next: CatalogFiltersState) => void
}

export function CatalogFilters({ facets, filters, onFiltersChange }: CatalogFiltersProps) {
  const toggleCategory = (slug: string) => {
    onFiltersChange({
      ...filters,
      categorySlugs: filters.categorySlugs.includes(slug)
        ? filters.categorySlugs.filter((s) => s !== slug)
        : [...filters.categorySlugs, slug],
    })
  }

  const toggleOccasion = (slug: string) => {
    onFiltersChange({
      ...filters,
      occasionSlugs: filters.occasionSlugs.includes(slug)
        ? filters.occasionSlugs.filter((s) => s !== slug)
        : [...filters.occasionSlugs, slug],
    })
  }

  const toggleFlower = (name: string) => {
    onFiltersChange({
      ...filters,
      flowerNames: filters.flowerNames.includes(name)
        ? filters.flowerNames.filter((f) => f !== name)
        : [...filters.flowerNames, name],
    })
  }

  const setPriceRange = (value: number[]) => {
    onFiltersChange({
      ...filters,
      priceMin: value[0] ?? facets.priceMin,
      priceMax: value[1] ?? facets.priceMax,
    })
  }

  const priceRangeValue = [filters.priceMin, filters.priceMax]

  return (
    <div className="space-y-6">
      {/* Категории */}
      {facets.categories.length > 0 && (
        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex w-full items-center justify-between py-1 text-sm font-medium text-foreground hover:text-foreground/90">
            Категория
            <ChevronDown className="h-4 w-4 shrink-0 transition-transform [[data-state=open]_&]:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2 space-y-2">
            {facets.categories.map(({ slug, name }) => (
              <label
                key={slug}
                className="flex items-center gap-2 cursor-pointer text-sm text-muted-foreground hover:text-foreground"
              >
                <Checkbox
                  checked={filters.categorySlugs.includes(slug)}
                  onCheckedChange={() => toggleCategory(slug)}
                />
                {name}
              </label>
            ))}
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Повод */}
      {facets.occasions.length > 0 && (
        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex w-full items-center justify-between py-1 text-sm font-medium text-foreground hover:text-foreground/90">
            Повод
            <ChevronDown className="h-4 w-4 shrink-0 transition-transform [[data-state=open]_&]:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2 space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
            {facets.occasions.map(({ slug, name }) => (
              <label
                key={slug}
                className="flex items-center gap-2 cursor-pointer text-sm text-muted-foreground hover:text-foreground"
              >
                <Checkbox
                  checked={filters.occasionSlugs.includes(slug)}
                  onCheckedChange={() => toggleOccasion(slug)}
                />
                {name}
              </label>
            ))}
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Цена */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex w-full items-center justify-between py-1 text-sm font-medium text-foreground hover:text-foreground/90">
          Цена
          <ChevronDown className="h-4 w-4 shrink-0 transition-transform [[data-state=open]_&]:rotate-180" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4">
          <Slider
            min={facets.priceMin}
            max={facets.priceMax}
            step={500}
            value={priceRangeValue}
            onValueChange={setPriceRange}
            className="w-full"
          />
          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            <span>{filters.priceMin.toLocaleString("ru-RU")} ₽</span>
            <span>{filters.priceMax.toLocaleString("ru-RU")} ₽</span>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Состав (цветы) */}
      {facets.flowers.length > 0 && (
        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex w-full items-center justify-between py-1 text-sm font-medium text-foreground hover:text-foreground/90">
            Состав
            <ChevronDown className="h-4 w-4 shrink-0 transition-transform [[data-state=open]_&]:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2 space-y-2">
            {facets.flowers.map((name) => (
              <label
                key={name}
                className="flex items-center gap-2 cursor-pointer text-sm text-muted-foreground hover:text-foreground"
              >
                <Checkbox
                  checked={filters.flowerNames.includes(name)}
                  onCheckedChange={() => toggleFlower(name)}
                />
                {name}
              </label>
            ))}
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  )
}
