"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  size?: string
  color?: string
  cartId: string
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "cartId">) => void
  removeItem: (cartId: string) => void
  updateQuantity: (cartId: string, quantity: number) => void
  clearCart: () => void
  total: number
  itemCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    const saved = localStorage.getItem("eddie-cart")
    if (saved) {
      const parsed = JSON.parse(saved)
      setItems(
        parsed.map((item: any) => ({
          ...item,
          cartId: item.cartId || `${item.id}-${item.size || ""}-${item.color || ""}`,
        })),
      )
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("eddie-cart", JSON.stringify(items))
  }, [items])

  const addItem = (item: Omit<CartItem, "cartId">) => {
    const cartId = `${item.id}-${item.size || ""}-${item.color || ""}`
    setItems((current) => {
      const existing = current.find((i) => i.cartId === cartId)
      if (existing) {
        return current.map((i) =>
          i.cartId === cartId ? { ...i, quantity: i.quantity + item.quantity } : i,
        )
      }
      return [...current, { ...item, cartId }]
    })
  }

  const removeItem = (cartId: string) => {
    setItems((current) => current.filter((item) => item.cartId !== cartId))
  }

  const updateQuantity = (cartId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(cartId)
      return
    }
    setItems((current) => current.map((item) => (item.cartId === cartId ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setItems([])
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within CartProvider")
  }
  return context
}
