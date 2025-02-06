"use client"

import { useState, useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import Image from "next/image"

const productSchema = z.object({
  productName: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  price: z
    .string()
    .min(1, "Price is required")
    .refine((val) => !isNaN(Number(val)), "Price must be a valid number"),
  category: z.string().min(1, "Category is required"),
  tags: z
    .string()
    .transform((val) => val.split(",").map((tag) => tag.trim()))
    .refine((val) => val.length > 0, "At least one tag is required"),
  discountPercentage: z
    .string()
    .optional()
    .refine((val) => val === "" || !isNaN(Number(val)), "Discount must be a valid number"),
  colors: z
    .string()
    .transform((val) => val.split(",").map((color) => color.trim()))
    .refine((val) => val.length > 0, "At least one color is required"),
  sizes: z
    .string()
    .transform((val) => val.split(",").map((size) => size.trim()))
    .refine((val) => val.length > 0, "At least one size is required"),
  inventory: z
    .string()
    .min(1, "Inventory is required")
    .refine((val) => !isNaN(Number(val)), "Inventory must be a valid number"),
  material: z.string().min(1, "Material is required"),
  dimensions: z.string().min(1, "Dimensions are required"),
  weight: z.string().min(1, "Weight is required"),
})

type ProductFormData = z.infer<typeof productSchema>

interface Category {
  _id: string
  name: string
}




export default function CreateProductPage({ product, onProductSaved }: any) {
  const [categories, setCategories] = useState<Category[]>([])
  const [images, setImages] = useState<File[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      productName: "",
      description: "",
      price: "",
      category: "",
      tags: [""],
      discountPercentage: "",
      colors: [""],
      sizes: [""],
      inventory: "",
      material: "",
      dimensions: "",
      weight: "",
    },
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    if (product) {
      reset({
        productName: product.productName,
        description: product.description || "",
        price: product.price.toString(),
        category: product.category._id,
        tags: product.tags.join(", "),
        discountPercentage: product.discountPercentage?.toString() || "",
        colors: product.colors.join(", "),
        sizes: product.sizes.join(", "),
        inventory: product.inventory.toString() || "",
        material: product.material,
        dimensions: product.dimensions,
        weight: product.weight,
      })
    }
  }, [product, reset])

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories")
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error("Failed to fetch categories:", error)
      toast({
        title: "Error",
        description: "Failed to load categories. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      setImages((prevImages) => [...prevImages, ...selectedFiles].slice(0, 4))
    }
  }

  const removeImage = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index))
  }

  const onSubmit = async (data: ProductFormData) => {
    if (images.length < 2 || images.length > 4) {
      setError("root", {
        type: "manual",
        message: "Please upload between 2 and 4 images.",
      })
      return
    }

    setIsLoading(true)

    try {
      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((item) => formData.append(key, item))
        } else {
          formData.append(key, value)
        }
      })
      images.forEach((image) => formData.append("images", image))

      if (product) {
        formData.append("id", product._id)
      }

      const response = await fetch(product ? "/api/create-product" : "/api/create-product", {
        method: product ? "PATCH" : "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Failed to ${product ? "update" : "create"} product`)
      }

     
      toast({
        title: "Success",
        description: `Product ${product ? "updated" : "created"} successfully!`,
      })
      onProductSaved()
    } catch (error) {
      console.error("Product creation/update error:", error)
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : `Failed to ${product ? "update" : "create"} product. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    reset()
    onProductSaved()
  }

  return (
    <div className="w-full p-4">
      <h1 className={`font-lusitana my-8 text-2xl `}>{product ? "Edit Product" : "Create New Product"}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="rounded-[8px]  bg-gray-50 p-4 md:p-6 space-y-4">
        <div className="flex flex-col items-center md:flex-row gap-2 w-full md:justify-between">
        <div className="flex-1">
          <Label htmlFor="productName" className="mb-2 block text-sm font-medium">Product Name</Label>
          <Controller
            name="productName"
            control={control}
            render={({ field }) => <Input                 className="peer bg-white block w-full rounded-md border border-gray-200 py-2 pl-2 text-sm outline-2 placeholder:text-gray-500" id="productName" {...field} />}
          />
          {errors.productName && <p className="text-red-500 text-sm mt-1">{errors.productName.message}</p>}
        </div>

        <div className="flex-1">
          <Label htmlFor="price">Price</Label>
          <Controller
            name="price"
            control={control}
            render={({ field }) => <Input                 className="peer bg-white block w-full rounded-md border border-gray-200 py-2 pl-2 text-sm outline-2 placeholder:text-gray-500" id="price" type="number" {...field} />}
          />
          {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
        </div>
        </div>
      
        
        <div className="flex flex-col md:flex-row gap-2 w-full md:justify-between">
        <div className="flex-1">
        <div>
          <Label htmlFor="category" className="mb-2 block text-sm font-medium">Category</Label>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value} >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select a category" className="bg-white"/>
                </SelectTrigger>
                <SelectContent className="peer block w-full cursor-pointer rounded-md border border-gray-200 bg-white text-black py-2 text-sm outline-2 placeholder:text-gray-500">
                  {categories.map((cat) => (
                    <SelectItem key={cat._id} value={cat._id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
        </div>
        </div>

        <div className="flex-1">
          <Label htmlFor="tags" className="mb-2 block text-sm font-medium">Tags</Label>
          <Controller
            name="tags"
            control={control}
            render={({ field }) => <Input                 className="peer bg-white block w-full rounded-md border border-gray-200 py-2 pl-2 text-sm outline-2 placeholder:text-gray-500" id="tags" {...field} placeholder="Enter tags separated by commas" />}
          />
          {errors.tags && <p className="text-red-500 text-sm mt-1">{errors.tags.message}</p>}
        </div>

        </div>

        <div className="flex flex-col md:flex-row gap-2 w-full md:justify-between">
        <div className="flex-1" >
        <div>
          <Label htmlFor="discountPercentage" className="mb-2 bg-white block text-sm font-medium">Discount Percentage</Label>
          <Controller
            name="discountPercentage"
            control={control}
            render={({ field }) => <Input                 className="peer bg-white block w-full rounded-md border border-gray-200 py-2 pl-2 text-sm outline-2 placeholder:text-gray-500" id="discountPercentage" type="number" {...field} />}
          />
          {errors.discountPercentage && (
            <p className="text-red-500 text-sm mt-1">{errors.discountPercentage.message}</p>
          )}
        </div>
        </div>
        <div className="flex-1">
          <Label htmlFor="colors" className="mb-2 block text-sm font-medium">Colors</Label>
          <Controller
            name="colors"
            control={control}
            render={({ field }) => <Input id="colors"                 className="peer bg-white block w-full rounded-md border border-gray-200 py-2 pl-2 text-sm outline-2 placeholder:text-gray-500" {...field} placeholder="Enter colors separated by commas" />}
          />
          {errors.colors && <p className="text-red-500 text-sm mt-1">{errors.colors.message}</p>}
        </div>

        </div>

        <div className="flex flex-col md:flex-row gap-2 w-full md:justify-between">
        <div className="flex-1">
        
          <Label htmlFor="sizes" className="mb-2 block text-sm font-medium">Sizes</Label>
          <Controller
            name="sizes"
            control={control}
            render={({ field }) => <Input id="sizes"                 className="peer bg-white block w-full rounded-md border border-gray-200 py-2 pl-2 text-sm outline-2 placeholder:text-gray-500" {...field} placeholder="Enter sizes separated by commas" />}
          />
          {errors.sizes && <p className="text-red-500 text-sm mt-1">{errors.sizes.message}</p>}
        </div>

        <div className="flex-1">
          <Label htmlFor="inventory" className="mb-2 block text-sm font-medium">Inventory</Label>
          <Controller
            name="inventory"
            control={control}
            render={({ field }) => <Input id="inventory"                 className="peer bg-white block w-full rounded-md border border-gray-200 py-2 pl-2 text-sm outline-2 placeholder:text-gray-500" type="number" {...field} />}
          />
          {errors.inventory && <p className="text-red-500 text-sm mt-1">{errors.inventory.message}</p>}
        </div>
        </div>


     <div className="flex flex-col md:flex-row gap-2 w-full md:justify-between">
<div className="flex-1">
        <div>
          <Label htmlFor="material" className="mb-2 block text-sm font-medium">Material</Label>
          <Controller name="material" control={control} render={({ field }) => <Input id="material" {...field}                 className="peer bg-white block w-full rounded-md border border-gray-200 py-2 pl-2 text-sm outline-2 placeholder:text-gray-500" />} />
          {errors.material && <p className="text-red-500 text-sm mt-1">{errors.material.message}</p>}
        </div>
        </div>
        <div className="flex-1">
          <Label htmlFor="dimensions" className="mb-2 block text-sm font-medium">Dimensions</Label>
          <Controller
            name="dimensions"
            control={control}
            render={({ field }) => <Input                 className="peer bg-white block w-full rounded-md border border-gray-200 py-2 pl-2 text-sm outline-2 placeholder:text-gray-500" id="dimensions" {...field} placeholder="e.g., 120x60x80 cm" />}
          />
          {errors.dimensions && <p className="text-red-500 text-sm mt-1">{errors.dimensions.message}</p>}
        </div>
</div>

        <div>
          <Label htmlFor="weight" className="mb-2 block text-sm font-medium">Weight</Label>
          <Controller name="weight" control={control} render={({ field }) => <Input                 className="peer bg-white block w-full rounded-md border border-gray-200 py-2 pl-2 text-sm outline-2 placeholder:text-gray-500" id="weight" {...field} />} />
          {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight.message}</p>}
        </div>


        <div>
          <Label htmlFor="description" className="mb-2 block text-sm font-medium">Description</Label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => <Textarea                 className="peer bg-white block w-full rounded-md border border-gray-200 py-2 pl-2 text-sm outline-2 placeholder:text-gray-500" id="description" {...field} />}
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
        </div>
        <div>
          <Label htmlFor="images" className="mb-2 block text-sm font-medium">Images (2-4)</Label>
          <Input                 className="peer bg-white block w-full rounded-md border border-gray-200 py-2 pl-2 text-sm outline-2 placeholder:text-gray-500" id="images" type="file" accept="image/*" multiple onChange={handleImageChange}  />
          <div className="flex flex-wrap gap-2">
            {images.map((image:File, index:number) => (
              <div key={index} className="relative" >
                <Image
                
                  src={URL.createObjectURL(image)}
                  width={80}
                  height={80}
                  alt={`Preview ${index}`}
                  className="w-24 h-24 object-cover rounded"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-0 right-0"
                  onClick={() => removeImage(index)}
                >
                  X
                </Button>
              </div>
            ))}
          </div>
          {errors.root && <p className="text-red-500 text-sm mt-1">{errors.root.message}</p>}
        </div>
        <div className="flex gap-2">
          <Button type="submit"     className="flex h-10 items-center rounded-[6px] bg-custom-green px-4 text-sm font-medium text-white transition-colors hover:bg-emerald-950" disabled={isLoading}>
            {isLoading ? `${product ? "Updating..." : "Creating..."}` : `${product ? "Update" : "Create"} Product`}
          </Button>
          <Button type="button" variant="outline" className="rounded-[6px] flex h-10 items-center bg-gray-100 px-4 text-sm border-none font-medium text-gray-600 transition-colors hover:bg-gray-200" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}



