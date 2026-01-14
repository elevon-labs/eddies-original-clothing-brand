import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateShipping(subtotal: number): number {
  return Math.ceil(subtotal * 0.03)
}

export function isNewProduct(createdAt: Date | string | null | undefined): boolean {
  if (!createdAt) return false
  const date = new Date(createdAt)
  const twoWeeksAgo = new Date()
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14)
  return date > twoWeeksAgo
}
