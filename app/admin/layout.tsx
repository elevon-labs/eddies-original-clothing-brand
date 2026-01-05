import { AdminLayout } from "@/components/admin/admin-layout"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { db } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  if (!session?.user) {
    redirect("/account/login")
  }

  // Check role directly from DB to handle manual role updates
  // or stale session data
  const user = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
    columns: {
      role: true,
    },
  })

  if (user?.role !== "admin") {
    redirect("/")
  }

  return <AdminLayout>{children}</AdminLayout>
}
