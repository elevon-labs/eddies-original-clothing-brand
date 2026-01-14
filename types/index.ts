export interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number | null
  image: string
  images?: string[]
  category: string | null
  collection?: string | null
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

export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  size?: string
  color?: string
  colorHex?: string
  cartId: string
  productId?: string // Optional back-compat if needed
}

export interface ShippingAddress {
  firstName: string
  lastName: string
  email: string
  phone: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  postalCode: string
  country: string
}

export interface OrderItem {
  id?: string
  orderId?: string
  productId: string
  productName: string
  quantity: number
  price: number
  selectedSize?: string
  selectedColor?: string
}

export interface OrderPayload {
  reference: string
  cartItems: CartItem[]
  shippingAddress: ShippingAddress
  email: string
  userId?: string | null
  totalAmount: number
  shippingCost?: number
}
