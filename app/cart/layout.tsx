import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Shopping Cart",
  description: "Review your shopping cart at Eddie Originals.",
  robots: {
    index: false,
    follow: true,
  },
}

export default function CartLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
