export interface CartItem {
  /** Уникальный ключ строки: slug + размер (если есть) */
  id: string
  slug: string
  name: string
  price: number
  image: string
  quantity: number
  sizeId?: string
  sizeLabel?: string
}

export function getCartItemId(slug: string, sizeId?: string): string {
  return sizeId ? `${slug}_${sizeId}` : slug
}
