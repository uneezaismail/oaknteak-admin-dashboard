"use client"

import { useEffect, useState } from "react"
import { client } from "@/sanity/lib/client"
import { toast } from "@/hooks/use-toast"
import Image from "next/image"
import { Edit, Plus, Trash2 } from "lucide-react"
import { SearchBar } from "@/components/search-and-create"
import { Button } from "@/components/ui/button"
import CreateProductPage from "../createProduct/page"

interface Product {
  _id: string
  product_id: string
  productName: string
  price: number
  category: {
    name: string
  }
  tags: string[]
  discountPercentage: number
  colors: string[]
  sizes: string[]
  inventory: number
  material: string
  dimensions: string
  weight: string
  images: {
    asset: {
      url: string
    }
  }[]
}

function ProductStatus({ inventory }: { inventory: number }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${
        inventory > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
      }`}
    >
      {inventory > 0 ? "In Stock" : "Out of Stock"}
    </span>
  )
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isFormVisible, setIsFormVisible] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const query = `*[_type == "product"] {
        _id,
        product_id,
        productName,
        price,
        category->{name},
        tags,
        discountPercentage,
        colors,
        sizes,
        inventory,
        material,
        dimensions,
        weight,
        "images": images[]{
          asset->{
            url
          }
        }
      }`
      const data = await client.fetch(query)
      setProducts(data)
      setFilteredProducts(data)
    } catch (error) {
      console.log(error)
      toast({ title: "Error", description: "Failed to fetch products", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const filtered = products.filter(
      (product) =>
        product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
        product.colors.some((color) => color.toLowerCase().includes(searchTerm.toLowerCase())) ||
        product.sizes.some((size) => size.toLowerCase().includes(searchTerm.toLowerCase())) ||
        product.price.toString().includes(searchTerm) ||
        product.inventory.toString().includes(searchTerm),
    )
    setFilteredProducts(filtered)
  }, [searchTerm, products])

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/create-product/?id=${id}`, {
        method: "DELETE",
      })
      if (response.ok) {
        toast({ title: "Success", description: "Product deleted successfully" })
        fetchProducts()
      } else {
        throw new Error("Failed to delete product")
      }
    } catch (error) {
      console.log(error)
      toast({ title: "Error", description: "Failed to delete product", variant: "destructive" })
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setIsFormVisible(true)
  }

  return (
    <div className="w-full container mx-auto p-4 lg:p-6 py-4">
      <div>

        {isFormVisible ? (
          <CreateProductPage
            product={editingProduct}
            onProductSaved={() => {
              setIsFormVisible(false)
              setEditingProduct(null)
              fetchProducts()
            }}
          />
        ) : (
          <>
        <h2 className={`font-lusitana my-8 text-2xl `}>Products</h2>

            <div className="flex justify-between gap-4 items-center mb-6">
              <SearchBar placeholder="Search product..." value={searchTerm} onChange={setSearchTerm} />
              <Button
                className="bg-custom-green text-sm md:text-base hover:bg-emerald-950 hover:text-white text-white rounded-[8px] h-auto py-[10px] font-medium"
                onClick={() => setIsFormVisible(true)}
              >
                Create Product
                <Plus />
              </Button>
            </div>
            <div className="mt-6 flow-root">
              <div className="inline-block min-w-full align-middle">
                <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
                  {loading ? (
                    <p className="text-center py-4">Loading products...</p>
                  ) : filteredProducts.length === 0 ? (
                    <p className="text-center py-4 text-gray-500">No products found.</p>
                  ) : (
                    <>
                      <div className="md:hidden">
                        {filteredProducts.map((product) => (
                          <div key={product._id} className="mb-2 w-full rounded-md bg-white p-4">
                            <div className="flex items-center justify-between border-b pb-4">
                              <div>
                                <div className="gap-2 flex items-center">
                                  <Image
                                    src={product.images[0]?.asset.url || "/placeholder.svg"}
                                    className="rounded"
                                    width={70}
                                    height={70}
                                    alt={`${product.productName} image`}
                                  />
                                  <div className="flex flex-col  ">
                                    <p className="font-bold">{product.productName}</p>
                                    <p className="text-sm text-gray-500">{product.category.name}</p>
                                  </div>
                                </div>
                              </div>
                              <ProductStatus inventory={product.inventory} />
                            </div>
                            <div className="flex w-full items-center border-b justify-between py-4">
                              <div>
                                <p className="text-lg font-semibold">Rs. {product.price}</p>
                                <p>
                                  Inventory: <span className="font-semibold">{product.inventory}</span>{" "}
                                </p>
                              </div>
                              <div className="flex justify-end gap-2">
                                <button
                                  className="border border-gray-200 rounded p-2"
                                  onClick={() => handleEdit(product)}
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button
                                  className="border border-gray-200 rounded p-2"
                                  onClick={() => handleDelete(product._id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                            <div className="flex items-center justify-between border-b py-4">
                              <p className="text-sm ">
                                <span>{product.colors.join(", ")}</span>
                              </p>
                              <p className="text-sm ">{product.sizes.join(", ")}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <table className="hidden min-w-full text-gray-900 md:table">
                        <thead className="rounded-[6px] text-left text-sm font-normal">
                          <tr>
                            <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                              Product
                            </th>
                            <th scope="col" className="px-3 py-5 font-medium">
                              Category
                            </th>
                            <th scope="col" className="px-3 py-5 font-medium">
                              Price
                            </th>
                            <th scope="col" className="px-3 py-5 font-medium">
                              Inventory
                            </th>
                            <th scope="col" className="px-3 py-5 font-medium">
                              Colors
                            </th>
                            <th scope="col" className="px-3 py-5 font-medium">
                              Sizes
                            </th>
                            <th scope="col" className="px-3 py-5 font-medium">
                              Status
                            </th>
                            <th scope="col" className="relative py-3 pl-6 pr-3">
                              <span className="sr-only">Actions</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white">
                          {filteredProducts.map((product) => (
                            <tr
                              key={product._id}
                              className="w-full bg-white text-black border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                            >
                              <td className="min-w-60 py-3 pl-6 pr-3 bg-white text-black ">
                                <div className="flex items-center gap-3">
                                  <Image
                                    src={product.images[0]?.asset.url }
                                    className="rounded"
                                    width={70}
                                    height={70}
                                    alt={`${product.productName} image`}
                                  />
                                  <p>{product.productName}</p>
                                </div>
                              </td>
                              <td className=" bg-white text-black px-3 py-3">
                                {product.category.name}
                              </td>
                              <td className="whitespace-nowrap px-3 py-3">Rs. {product.price}</td>
                              <td className="whitespace-nowrap px-3 py-3">{product.inventory}</td>
                              <td className="whitespace-nowrap px-3 py-3">{product.colors.join(", ")}</td>
                              <td className="whitespace-nowrap px-3 py-3">{product.sizes.join(", ")}</td>
                              <td className="whitespace-nowrap px-3 py-3">
                                <ProductStatus inventory={product.inventory} />
                              </td>
                              <td className="whitespace-nowrap py-3 pl-6 pr-3">
                                <div className="flex justify-end gap-3">
                                  <button
                                    className="border border-gray-200 text-blue-500 rounded p-2"
                                    onClick={() => handleEdit(product)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </button>
                                  <button
                                     className="border border-gray-200 text-red-500 rounded p-2"
                                    onClick={() => handleDelete(product._id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

