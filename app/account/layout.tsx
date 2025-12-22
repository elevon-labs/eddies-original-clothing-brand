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
