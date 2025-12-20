"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface CartItem {
  id: number
  name: string
  price: number
  image: string
  quantity: number
  size?: string
  color?: string
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
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
      setItems(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("eddie-cart", JSON.stringify(items))
  }, [items])

  const addItem = (item: CartItem) => {
    setItems((current) => {
      const existing = current.find((i) => i.id === item.id && i.size === item.size)
      if (existing) {
        return current.map((i) => (i.id === item.id && i.size === item.size ? { ...i, quantity: i.quantity + 1 } : i))
      }
      return [...current, { ...item, quantity: 1 }]
    })
  }

  const removeItem = (id: number) => {
    setItems((current) => current.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }
    setItems((current) => current.map((item) => (item.id === id ? { ...item, quantity } : item)))
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
