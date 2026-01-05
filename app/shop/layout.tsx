import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Shop All Products",
  description: "Browse our complete collection of luxury streetwear. Hoodies, jackets, tees, and more.",
}

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
