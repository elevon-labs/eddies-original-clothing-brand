export interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number | null
  image: string
  images?: string[]
  category: string | null
  description?: string | null
  badge?: string | null
  rating?: number
  reviews?: number
  stockCount?: number
  isActive?: boolean
  sizes?: string[]
  colors?: { name: string; hex: string }[]
  createdAt?: Date | string | null
}
