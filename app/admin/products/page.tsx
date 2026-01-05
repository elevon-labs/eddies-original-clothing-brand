import Link from "next/link"
import type { Metadata } from "next"
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductsList } from "@/components/admin/products-list"

export const metadata: Metadata = {
  title: "Products | Eddie Originals Admin",
  description: "Manage product inventory",
}

export default function AdminProductsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Product Management</h1>
          <p className="text-muted-foreground mt-2">Manage your product catalog and inventory</p>
        </div>
        <Button asChild className="bg-black text-white hover:bg-neutral-800 w-full sm:w-auto">
          <Link href="/admin/products/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>

      <ProductsList />
    </div>
  )
}
