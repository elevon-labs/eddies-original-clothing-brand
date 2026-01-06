import { Metadata } from "next"

export const metadata: Metadata = {
  title: "My Account",
  description: "Manage your Eddie Originals account.",
  robots: {
    index: false,
    follow: false,
  },
}

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-screen font-sans">
      {children}
    </div>
  )
}
