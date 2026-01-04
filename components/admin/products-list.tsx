"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Card, CardContent } from "@/components/ui/card"
import { Edit, Trash2, Search, ArrowUpDown } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Mock product data - Expanded for pagination
const initialProducts = [
  {
    id: "1",
    name: "Classic Black Bomber",
    image: "/black-bomber-streetwear.png",
    price: 89000,
    stock: 15,
    visible: true,
    category: "Outerwear",
    collection: "Winter 2024",
  },
  {
    id: "2",
    name: "Oversized Graphic Tee",
    image: "/black-oversized-tee-luxury-streetwear.jpg",
    price: 35000,
    stock: 3,
    visible: true,
    category: "Tees",
    collection: "Streetwear",
  },
  {
    id: "3",
    name: "Premium Joggers",
    image: "/black-joggers-streetwear.jpg",
    price: 65000,
    stock: 8,
    visible: true,
    category: "Bottoms",
    collection: "Essentials",
  },
  {
    id: "4",
    name: "Crewneck Sweatshirt",
    image: "/black-crewneck-graphic-streetwear.jpg",
    price: 55000,
    stock: 0,
    visible: false,
    category: "Hoodies",
    collection: "Winter 2024",
  },
  {
    id: "5",
    name: "Vintage Wash Hoodie",
    image: "/placeholder.svg",
    price: 75000,
    stock: 12,
    visible: true,
    category: "Hoodies",
    collection: "Essentials",
  },
  {
    id: "6",
    name: "Cargo Pants",
    image: "/placeholder.svg",
    price: 58000,
    stock: 6,
    visible: true,
    category: "Bottoms",
    collection: "Streetwear",
  },
  {
    id: "7",
    name: "Signature Cap",
    image: "/placeholder.svg",
    price: 25000,
    stock: 25,
    visible: true,
    category: "Accessories",
    collection: "Essentials",
  },
  {
    id: "8",
    name: "Heavyweight Cotton Tee",
    image: "/placeholder.svg",
    price: 42000,
    stock: 4,
    visible: true,
    category: "Tees",
    collection: "Summer 2024",
  },
  {
    id: "9",
    name: "Windbreaker Jacket",
    image: "/placeholder.svg",
    price: 95000,
    stock: 9,
    visible: true,
    category: "Outerwear",
    collection: "Spring 2024",
  },
  {
    id: "10",
    name: "Denim Jacket",
    image: "/placeholder.svg",
    price: 110000,
    stock: 2,
    visible: true,
    category: "Outerwear",
    collection: "Essentials",
  },
  {
    id: "11",
    name: "Beanie",
    image: "/placeholder.svg",
    price: 18000,
    stock: 30,
    visible: true,
    category: "Accessories",
    collection: "Winter 2024",
  },
  {
    id: "12",
    name: "Socks (3-Pack)",
    image: "/placeholder.svg",
    price: 15000,
    stock: 50,
    visible: true,
    category: "Accessories",
    collection: "Essentials",
  },
  {
    id: "13",
    name: "Puffer Vest",
    image: "/placeholder.svg",
    price: 68000,
    stock: 0,
    visible: false,
    category: "Outerwear",
    collection: "Winter 2024",
  },
  {
    id: "14",
    name: "Shorts",
    image: "/placeholder.svg",
    price: 45000,
    stock: 18,
    visible: true,
    category: "Bottoms",
    collection: "Summer 2024",
  },
  {
    id: "15",
    name: "Graphic Long Sleeve",
    image: "/placeholder.svg",
    price: 48000,
    stock: 7,
    visible: true,
    category: "Tees",
    collection: "Spring 2024",
  },
]

type SortConfig = {
  key: "name" | "price" | "stock"
  direction: "asc" | "desc"
}

export function ProductsList() {
  const [products, setProducts] = useState(initialProducts)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: "name", direction: "asc" })
  const [currentPage, setCurrentPage] = useState(1)
  const { toast } = useToast()

  const itemsPerPage = 10

  // Filter Logic
  const filteredProducts = products.filter((product) => {
    const query = searchQuery.toLowerCase()
    return (
      product.name.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query) ||
      product.collection.toLowerCase().includes(query)
    )
  })

  // Sort Logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const { key, direction } = sortConfig
    if (key === "name") {
      return direction === "asc" 
        ? a.name.localeCompare(b.name) 
        : b.name.localeCompare(a.name)
    }
    if (key === "price") {
      return direction === "asc" ? a.price - b.price : b.price - a.price
    }
    if (key === "stock") {
      return direction === "asc" ? a.stock - b.stock : b.stock - a.stock
    }
    return 0
  })

  // Pagination Logic
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage)
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const toggleVisibility = (id: string) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, visible: !p.visible } : p)))
    toast({
      title: "Visibility updated",
      description: "Product visibility has been changed",
    })
  }

  const deleteProduct = (id: string, name: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id))
    toast({
      title: "Product deleted",
      description: `${name} has been removed from catalog`,
      variant: "destructive",
    })
  }

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: "Out", variant: "destructive" as const, color: "text-red-600" }
    if (stock < 5) return { label: "Low", variant: "outline" as const, color: "text-yellow-600" }
    return { label: "In Stock", variant: "default" as const, color: "text-green-600" }
  }

  return (
    <Card className="bg-white border-neutral-200 text-black">
      <CardContent className="p-0">
        <div className="p-4 border-b border-neutral-200 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between gap-4">
          
          {/* Search */}
          <div className="relative w-full md:max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-500" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-9 w-full bg-neutral-50 border-neutral-200 focus:bg-white transition-colors"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1) // Reset to page 1 on search
              }}
            />
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-sm font-medium whitespace-nowrap text-muted-foreground hidden md:inline">Sort by:</span>
            <Select 
              value={`${sortConfig.key}-${sortConfig.direction}`} 
              onValueChange={(value) => {
                const [key, direction] = value.split("-") as [string, "asc" | "desc"]
                setSortConfig({ key: key as "name" | "price" | "stock", direction })
              }}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                <SelectItem value="price-asc">Price (Low-High)</SelectItem>
                <SelectItem value="price-desc">Price (High-Low)</SelectItem>
                <SelectItem value="stock-asc">Stock (Low-High)</SelectItem>
                <SelectItem value="stock-desc">Stock (High-Low)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">Image</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Collection</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead className="text-center">Visible</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((product) => {
                  const stockStatus = getStockStatus(product.stock)
                  return (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="relative h-16 w-16 rounded-md overflow-hidden bg-neutral-100">
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{product.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-neutral-100 text-neutral-800 hover:bg-neutral-200">{product.collection}</Badge>
                      </TableCell>
                      <TableCell>₦{product.price.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge variant={stockStatus.variant}>{stockStatus.label}</Badge>
                          <span className={stockStatus.color}>{product.stock}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Switch checked={product.visible} onCheckedChange={() => toggleVisibility(product.id)} />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="icon" asChild>
                            <Link href={`/admin/products/${product.id}/edit`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="icon">
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-white text-black">
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Product?</AlertDialogTitle>
                                <AlertDialogDescription className="text-neutral-600">
                                  This will permanently delete {product.name}. This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="bg-neutral-100 text-black hover:bg-neutral-200 border-neutral-200">Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteProduct(product.id, product.name)}
                                  className="bg-red-600 hover:bg-red-700 text-white"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    No products found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4 p-4 bg-neutral-50/50">
          {paginatedProducts.length > 0 ? (
            paginatedProducts.map((product) => {
              const stockStatus = getStockStatus(product.stock)
              return (
                <div key={product.id} className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm">
                  <div className="flex gap-4">
                    {/* Image */}
                    <div className="relative h-20 w-20 flex-shrink-0 rounded-lg overflow-hidden bg-neutral-100 border border-neutral-100">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    {/* Main Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-semibold text-base text-black line-clamp-2">{product.name}</h3>
                        <p className="font-semibold text-black whitespace-nowrap">₦{product.price.toLocaleString()}</p>
                      </div>
                      <div className="mt-1 flex flex-wrap gap-2">
                        <Badge variant="secondary" className="text-xs bg-neutral-100 text-neutral-600 hover:bg-neutral-200 border-0">
                          {product.collection}
                        </Badge>
                        <Badge variant={stockStatus.variant} className="text-xs">
                          {stockStatus.label}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Stock & Category */}
                  <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground border-t border-neutral-100 pt-3">
                     <div className="flex items-center gap-4">
                        <span>{product.category}</span>
                        <span className="w-1 h-1 rounded-full bg-neutral-300"></span>
                        <span>Stock: <span className={stockStatus.color + " font-medium"}>{product.stock}</span></span>
                     </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Switch 
                        checked={product.visible} 
                        onCheckedChange={() => toggleVisibility(product.id)}
                        className="scale-90"
                      />
                      <span className="text-sm font-medium text-neutral-600">
                        {product.visible ? 'Visible' : 'Hidden'}
                      </span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild className="h-8 px-3 text-xs">
                        <Link href={`/admin/products/${product.id}/edit`}>
                          <Edit className="h-3 w-3 mr-1.5" />
                          Edit
                        </Link>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="h-8 px-3 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100">
                            <Trash2 className="h-3 w-3 mr-1.5" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-white text-black">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Product?</AlertDialogTitle>
                            <AlertDialogDescription className="text-neutral-600">
                              This will permanently delete {product.name}. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-neutral-100 text-black hover:bg-neutral-200 border-neutral-200">Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteProduct(product.id, product.name)}
                              className="bg-red-600 hover:bg-red-700 text-white"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No products found matching your search.
            </div>
          )}
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-neutral-200">
             <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="gap-1 pl-2.5"
                  >
                    <span>Previous</span>
                  </Button>
                </PaginationItem>
                
                {Array.from({ length: totalPages }).map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      isActive={currentPage === i + 1}
                      onClick={() => handlePageChange(i + 1)}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                   <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="gap-1 pr-2.5"
                  >
                    <span>Next</span>
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
