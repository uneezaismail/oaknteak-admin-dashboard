
"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { toast } from "@/hooks/use-toast"
import { SearchBar } from "../search-and-create"
import { Button } from "@/components/ui/button"
import { Star, Trash2 } from "lucide-react"
import { client } from "@/sanity/lib/client"

interface Review {
  _id: string
  customer: {
    firstName: string
    lastName: string
  }
  customerEmail: string
  product: {
    productName: string
  }
  rating: number
  reviewText: string
}

export default function ReviewTable() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const query = `
          *[_type == "review"]{
            _id,
            rating,
            reviewText,
            customerEmail,
            createdAt,
            product->{
              productName
            },
            customer->{
              firstName,
              lastName
            }
          }
        `;

        const data = await client.fetch(query)
        setReviews(data)
        setFilteredReviews(data)
      } catch (error) {
        console.log(error)
        toast({ title: "Error", description: "Failed to fetch reviews", variant: "destructive" })
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [])

  useEffect(() => {
    const filtered = reviews.filter(
      (review) =>
        review.product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${review.customer.firstName} ${review.customer.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.rating.toString().includes(searchTerm) ||
        review.reviewText.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredReviews(filtered)
  }, [searchTerm, reviews])

  const handleDelete = async (id: string) => {
    try {
        await axios.delete("/api/reviews", { data: { id } });
      setReviews(reviews.filter((review) => review._id !== id))
      setFilteredReviews(filteredReviews.filter((review) => review._id !== id))
      toast({ title: "Success", description: "Review deleted successfully", variant: "destructive" })
    } catch (error) {
      console.log(error)
      toast({ title: "Error", description: "Failed to delete review", variant: "destructive" })
    }
  }

  return (
    <div className="w-full p-4">
  <h2 className={`font-lusitana my-8 text-2xl `}>Customer Reviews</h2>
  <SearchBar placeholder="Search reviews by product..." value={searchTerm} onChange={setSearchTerm} />

  <div className="mt-6 flow-root">
    <div className="overflow-x-auto">
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-hidden rounded-md bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {loading ? (
              <p className="text-center py-4">Loading reviews...</p>
            ) : filteredReviews.length > 0 ? (
              filteredReviews.map((review) => (
                <div key={review._id} className="mb-2 w-full rounded-md bg-white p-4">
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <div className="mb-1 flex flex-col">
                        <p className="font-medium text-lg sm:text-xl">{review.product.productName}</p>
                        <p className="text-sm sm:text-base text-gray-500">{review.customerEmail}</p>
                        <div className="flex">
                          {Array.from({ length: review.rating }, (_, index) => (
                            <Star
                              key={index}
                              fill="currentColor"
                              className="h-4 w-4 text-yellow-500"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm">
                      <Button variant="destructive" className="shadow-none h-10 " onClick={() => handleDelete(review._id)}>
                        <Trash2 className="h-6 w-6 text-red-600" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex py-5">
                    <div className="flex flex-col w-full">
                      <p className="text-sm">Review</p>
                      <p className="font-medium">{review.reviewText}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="w-full text-center content-center min-h-40 text-gray-500">No reviews found</div>
            )}
          </div>
          <div className="hidden md:block">
            <table className="min-w-full rounded-md text-gray-900">
              <thead className="rounded-md bg-gray-50 text-left text-sm lg:text-base font-normal">
                <tr>
                  <th scope="col" className="px-4 py-5 font-medium sm:pl-6">Product</th>
                  <th scope="col" className="px-4 py-5 font-medium">Customer</th>
                  <th scope="col" className="px-4 py-5 font-medium">Email</th>
                  <th scope="col" className="px-4 py-5 font-medium">Rating</th>
                  <th scope="col" className="px-4 py-5 font-medium">Review</th>
                  <th scope="col" className="px-4 py-5 font-medium">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y text-sm divide-gray-200 bg-white text-gray-900">
                {filteredReviews.length > 0 ? (
                  filteredReviews.map((review) => (
                    <tr key={review._id} className="text-sm ">
                      <td className="px-4 py-4">{review.product.productName}</td>
                      <td className="px-4 py-4">{`${review.customer.firstName} ${review.customer.lastName}`}</td>
                      <td className="px-4 py-4">{review.customerEmail}</td>
                      <td className="px-4 py-4">{review.rating}</td>
                      <td className="px-4 py-4">{review.reviewText}</td>
                      <td className="px-4 py-4">
                        <Button variant="destructive" className="shadow-none h-10 " onClick={() => handleDelete(review._id)}>
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="h-60">
                    <td colSpan={6} className="text-center text-lg">
                      No reviews found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

  )
}
