export interface ProductSize {
  id: string
  label: string
  price: number
  available: boolean
}

export interface ProductOption {
  id: string
  name: string
  price: number
  description?: string
}

export interface ProductComposition {
  flowers: string[]
  packaging: string[]
  height: string
  diameter: string
}

export interface DeliveryInfo {
  intervals: {
    label: string
    moscow: string
    outsideMkad?: string
  }[]
}

export interface Product {
  id: string
  slug: string
  name: string
  sku: string
  price: number
  originalPrice?: number
  inStock: boolean
  images: string[]
  sizes?: ProductSize[]
  category: {
    name: string
    slug: string
  }
  description: string
  composition: ProductComposition
  delivery: DeliveryInfo
  careInstructions: string
  options?: ProductOption[]
}
