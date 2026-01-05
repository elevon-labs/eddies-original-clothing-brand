import Link from "next/link"
import type { Metadata } from "next"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductForm } from "@/components/admin/product-form"

export const metadata: Metadata = {
  title: "Add Product | Eddie Originals Admin",
  description: "Add a new product to the catalog",
}

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/products">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Product</h1>
          <p className="text-muted-foreground mt-2">Create a new product listing</p>
        </div>
      </div>

      <ProductForm />
    </div>
  )
}
