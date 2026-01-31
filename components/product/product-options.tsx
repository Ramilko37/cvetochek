"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import type { ProductOption } from "@/types/product"

interface ProductOptionsProps {
  options: ProductOption[]
  selected?: string[]
  onChange?: (optionId: string, checked: boolean) => void
}

export function ProductOptions({
  options,
  selected: controlledSelected,
  onChange: controlledOnChange,
}: ProductOptionsProps) {
  const [internalSelected, setInternalSelected] = useState<string[]>([])

  const selected = controlledSelected ?? internalSelected

  const handleChange = (optionId: string, checked: boolean) => {
    const next = checked
      ? [...selected, optionId]
      : selected.filter((id) => id !== optionId)

    if (controlledSelected === undefined) {
      setInternalSelected(next)
    }
    controlledOnChange?.(optionId, checked)
  }

  if (options.length === 0) return null

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-foreground">Дополнительно</p>
      <div className="space-y-3">
        {options.map((option) => (
          <label
            key={option.id}
            className={cn(
              "flex items-start gap-3 p-3 rounded-xl border border-border",
              "cursor-pointer hover:bg-muted/50 transition-colors",
            )}
          >
            <Checkbox
              checked={selected.includes(option.id)}
              onCheckedChange={(checked) =>
                handleChange(option.id, checked === true)
              }
              className="mt-0.5"
            />
            <div className="flex-1 min-w-0">
              <span className="text-sm font-medium text-foreground">
                {option.name}
                {option.price > 0 && (
                  <span className="text-muted-foreground font-normal ml-1">
                    +{option.price.toLocaleString("ru-RU")} ₽
                  </span>
                )}
              </span>
              {option.description && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {option.description}
                </p>
              )}
            </div>
          </label>
        ))}
      </div>
    </div>
  )
}
