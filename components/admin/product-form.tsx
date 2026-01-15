"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Upload, X, Star, Plus, Info } from "lucide-react"

const sizes = ["XS", "S", "M", "L", "XL", "XXL"]
const categories = ["Tees", "Hoodies", "Outerwear", "Bottoms", "Accessories"]
const collections = ["Winter Essentials", "Street Classics", "Premium Outerwear", "Accessories"]

const getColorHex = (str: string) => {
  if (typeof window === "undefined") return null
  const ctx = document.createElement("canvas").getContext("2d")
  if (!ctx) return null
  ctx.fillStyle = "#ffffff"
  ctx.fillStyle = str
  if (ctx.fillStyle === "#ffffff" && str.toLowerCase() !== "white" && str !== "#ffffff" && str !== "#fff") {
    return null
  }
  return ctx.fillStyle
}

export interface ProductData {
  id?: string
  name: string
  description: string
  category: string
  collection: string
  prices: { original: string; selling: string }
  stock: string
  sizes: string[]
  colors: { name: string; hex: string }[]
  images: { id: string; file?: File; preview: string }[]
}

export function ProductForm({ initialData }: { initialData?: ProductData }) {
  const router = useRouter()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [loading, setLoading] = useState(false)
  const [selectedSizes, setSelectedSizes] = useState<string[]>(initialData?.sizes || [])
  const [colors, setColors] = useState<{ name: string; hex: string }[]>(initialData?.colors || [])
  const [newColor, setNewColor] = useState({ name: "", hex: "#000000" })
  
  const [category, setCategory] = useState(() => {
    if (!initialData?.category) return ""
    const match = categories.find(c => c.toLowerCase() === initialData.category.toLowerCase())
    return match || initialData.category
  })
  const [collection, setCollection] = useState(() => {
    if (!initialData?.collection) return ""
    const match = collections.find(c => c.toLowerCase() === initialData.collection.toLowerCase())
    return match || initialData.collection
  })

  // Advanced Image Management
  const [productImages, setProductImages] = useState<{ id: string; file?: File; preview: string }[]>(initialData?.images || [])
  const [isDragging, setIsDragging] = useState(false)

  const [prices, setPrices] = useState(initialData?.prices || { original: "", selling: "" })

  const processFiles = (files: FileList | null) => {
    if (!files) return

    const newImages: { id: string; file: File; preview: string }[] = []
    
    Array.from(files).forEach((file) => {
       // Validate file type
       if (!file.type.startsWith("image/")) return
       
       // Limit to 5 images total
       if (productImages.length + newImages.length >= 5) return

       newImages.push({
         id: Math.random().toString(36).substring(7),
         file,
         preview: URL.createObjectURL(file),
       })
    })

    if (newImages.length > 0) {
      setProductImages((prev) => [...prev, ...newImages])
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files)
    // Reset input to allow re-uploading the same file if deleted
    e.target.value = ""
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    processFiles(e.dataTransfer.files)
  }

  const removeImage = (id: string) => {
    setProductImages((prev) => prev.filter((img) => img.id !== id))
  }

  const setMainImage = (index: number) => {
    setProductImages((prev) => {
      const newImages = [...prev]
      const [moved] = newImages.splice(index, 1)
      newImages.unshift(moved)
      return newImages
    })
  }

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) => (prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]))
  }

  const addColor = () => {
    if (newColor.name) {
      setColors((prev) => [...prev, newColor])
      setNewColor({ name: "", hex: "#000000" })
    }
  }

  const removeColor = (index: number) => {
    setColors((prev) => prev.filter((_, i) => i !== index))
  }

  const uploadImage = async (file: File) => {
    try {
      // 1. Get signature
      const timestamp = Math.round((new Date()).getTime() / 1000);
      const paramsToSign = {
        timestamp,
        upload_preset: "eddie-originals",
        folder: "products",
      };
  
      const signatureRes = await fetch("/api/upload-signature", {
        method: "POST",
        body: JSON.stringify({ paramsToSign }),
      });
      
      if (!signatureRes.ok) throw new Error("Failed to get upload signature");
      const { signature, apiKey, cloudName } = await signatureRes.json();
  
      // 2. Upload to Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("timestamp", timestamp.toString());
      formData.append("signature", signature);
      formData.append("upload_preset", "eddie-originals");
      formData.append("folder", "products");
  
      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
  
      if (!uploadRes.ok) throw new Error("Image upload failed");
      const data = await uploadRes.json();
      return data.secure_url;
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Upload images
      const uploadedImageUrls = await Promise.all(
        productImages.map(async (img) => {
          if (img.file) {
            return await uploadImage(img.file);
          }
          return img.preview; // Assume preview is the URL if no file (edit mode)
        })
      );

      const productData = {
        name: (document.getElementById("name") as HTMLInputElement).value,
        description: (document.getElementById("description") as HTMLTextAreaElement).value,
        category,
        collection,
        prices,
        stock: (document.getElementById("stock") as HTMLInputElement).value,
        sizes: selectedSizes,
        colors,
        images: uploadedImageUrls
      };

      const url = initialData?.id ? `/api/products/${initialData.id}` : "/api/products";
      const method = initialData?.id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      if (!res.ok) throw new Error("Failed to save product");

      toast({
        title: initialData ? "Product updated" : "Product created",
        description: initialData 
          ? "Your product changes have been saved" 
          : "Your product has been added to the catalog",
      })
      router.push("/admin/products")
    } catch (error) {
      console.error("Submit error:", error);
      toast({
        title: "Error",
        description: "Failed to save product. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-6">
        {/* Row 1: Essentials & Inventory */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="bg-white border-neutral-200 text-black h-full flex flex-col">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle>Product Essentials</CardTitle>
              <CardDescription>Basic product information</CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 space-y-4 flex-1">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input 
                  id="name" 
                  defaultValue={initialData?.name}
                  placeholder="e.g., Classic Black Bomber" 
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description <span className="text-xs text-neutral-500 font-normal">(Min. 15 words)</span></Label>
                <Textarea 
                  id="description" 
                  defaultValue={initialData?.description}
                  placeholder="Describe the product, materials, fit, etc." 
                  rows={5} 
                  required 
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={setCategory} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="collection">Collection</Label>
                  <Select value={collection} onValueChange={setCollection} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select collection" />
                    </SelectTrigger>
                    <SelectContent>
                      {collections.map((col) => (
                        <SelectItem key={col} value={col}>
                          {col}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-neutral-200 text-black h-full flex flex-col">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle>Inventory Details</CardTitle>
              <CardDescription>Stock, sizes, and colors</CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 space-y-4 flex-1">
              <div className="space-y-2">
                <Label>Available Sizes</Label>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <Button
                      key={size}
                      type="button"
                      variant={selectedSizes.includes(size) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleSize(size)}
                      className={selectedSizes.includes(size) ? "bg-black text-white" : ""}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Colors</Label>
                <div className="flex flex-wrap gap-2 items-end">
                  <div className="flex-1 min-w-[150px]">
                    <Input
                      placeholder="Color name"
                      value={newColor.name}
                      onChange={(e) => {
                        const name = e.target.value
                        const hex = getColorHex(name)
                        if (hex && hex.startsWith("#") && hex.length === 7) {
                          setNewColor({ name, hex })
                        } else {
                          setNewColor({ ...newColor, name })
                        }
                      }}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={newColor.hex}
                      onChange={(e) => setNewColor({ ...newColor, hex: e.target.value })}
                      className="w-16 p-1 h-10 cursor-pointer"
                    />
                    <Button type="button" onClick={addColor} variant="outline">
                      Add
                    </Button>
                  </div>
                </div>
                {colors.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {colors.map((color, index) => (
                      <Badge key={index} variant="secondary" className="gap-2">
                        <div className="w-3 h-3 rounded-full border" style={{ backgroundColor: color.hex }} />
                        {color.name}
                        <button
                          type="button"
                          onClick={() => removeColor(index)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock">Stock Count</Label>
                <Input 
                  id="stock" 
                  type="number" 
                  defaultValue={initialData?.stock}
                  placeholder="50" 
                  required 
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Row 2: Pricing & Images */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="bg-white border-neutral-200 text-black h-full flex flex-col">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle>Pricing & Badges</CardTitle>
              <CardDescription>Set pricing and automatic sale badges</CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 space-y-6 flex-1">
              <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-3 text-sm text-neutral-600 flex gap-3">
                <Info className="w-5 h-5 flex-shrink-0 text-black" />
                <div className="space-y-1">
                  <p className="font-medium text-black">Automatic Sale Badge</p>
                  <p>
                    When the <span className="font-medium">Selling Price</span> is set lower than the <span className="font-medium">Original Price</span>, 
                    a discount percentage badge will be automatically calculated and displayed on the product card.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="original-price">Original Price (₦)</Label>
                  <Input 
                    id="original-price" 
                    type="number" 
                    placeholder="99000" 
                    value={prices.original}
                    onChange={(e) => setPrices({...prices, original: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="selling-price">Selling Price (₦)</Label>
                  <Input 
                    id="selling-price" 
                    type="number" 
                    placeholder="89000" 
                    required 
                    value={prices.selling}
                    onChange={(e) => setPrices({...prices, selling: e.target.value})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-neutral-200 text-black h-full flex flex-col">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle>Product Images</CardTitle>
              <CardDescription>Upload up to 5 product photos. First image is the cover.</CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 flex-1">
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                multiple 
                onChange={handleImageUpload}
              />
              
              <div className="space-y-4">
                {/* Upload Area - Large when empty */}
                {productImages.length === 0 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`w-full h-32 flex flex-col items-center justify-center border-2 border-dashed rounded-lg transition-all outline-none ${
                      isDragging 
                        ? "border-black bg-neutral-50 ring-2 ring-black/5" 
                        : "border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50"
                    }`}
                  >
                    <div className="p-3 bg-neutral-100 rounded-full mb-2">
                      <Upload className="h-5 w-5 text-neutral-500" />
                    </div>
                    <span className="text-sm font-medium text-neutral-900">
                      Click to upload or drag and drop
                    </span>
                    <span className="text-xs text-neutral-500 mt-1">
                      SVG, PNG, JPG or GIF (max. 800x400px)
                    </span>
                  </button>
                )}

                {/* Image Grid - Compact row when populated */}
                {productImages.length > 0 && (
                  <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4">
                    {productImages.map((img, index) => (
                      <div 
                        key={img.id} 
                        className={`relative aspect-square rounded-lg overflow-hidden border bg-white group ${
                          index === 0 ? "border-black ring-1 ring-black" : "border-neutral-200"
                        }`}
                      >
                        <Image
                          src={img.preview}
                          alt={`Product ${index + 1}`}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                        
                        {/* Actions Overlay */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                          {index !== 0 && (
                            <Button
                              type="button"
                              variant="secondary"
                              size="icon"
                              className="h-7 w-7 bg-white/90 hover:bg-white text-neutral-900"
                              onClick={() => setMainImage(index)}
                              title="Set as Main"
                            >
                              <Star className="h-3.5 w-3.5" />
                            </Button>
                          )}
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => removeImage(img.id)}
                            title="Remove"
                          >
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        </div>

                        {/* Labels */}
                        {index === 0 && (
                          <div className="absolute top-1.5 left-1.5 bg-black/80 text-white text-[10px] font-medium px-1.5 py-0.5 rounded backdrop-blur-sm">
                            Main
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {/* Compact Upload Button */}
                    {productImages.length < 5 && (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`aspect-square flex flex-col items-center justify-center border-2 border-dashed rounded-lg transition-all outline-none ${
                          isDragging 
                            ? "border-black bg-neutral-50" 
                            : "border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50"
                        }`}
                      >
                        <Plus className="h-5 w-5 text-neutral-400 mb-1" />
                        <span className="text-xs font-medium text-neutral-500">Add</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center mt-4 text-xs text-muted-foreground">
                 <span>{productImages.length}/5 images</span>
                 <span>Supported formats: JPG, PNG, WebP</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4 mt-8">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => router.push("/admin/products")}
          className="w-full sm:w-auto h-12 sm:h-10 text-base sm:text-sm"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          className="bg-black text-white hover:bg-neutral-800 w-full sm:w-auto h-12 sm:h-10 text-base sm:text-sm" 
          disabled={loading}
        >
          {loading 
            ? (initialData ? "Saving..." : "Creating...") 
            : (initialData ? "Save Changes" : "Create Product")
          }
        </Button>
      </div>
    </form>
  )
}
