import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Collections",
  description: "Explore our latest streetwear collections. Winter Essentials, Street Classics, and Premium Outerwear.",
}

export default function CollectionsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
