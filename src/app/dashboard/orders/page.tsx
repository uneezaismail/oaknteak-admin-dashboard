"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { toast } from "@/hooks/use-toast"
import { SearchBar } from "@/components/search-and-create"
import { client } from "@/sanity/lib/client"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Customer {
  firstName?: string
  lastName?: string
  email?: string
}

interface OrderItem {
  name: string
  quantity: number
}

interface Order {
  _id: string
  customer?: Customer
  items: OrderItem[]
  totalPrice: number
  paymentMethod: string
  shipmentStatus: string
  trackingNumber?: string
  shippingMethod: string
  createdAt?: string
  address: any
}

export default function OrdersTable() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const query = `*[_type == "order"]{
          _id, customer-> {firstName, lastName, email}, items, address, totalPrice, 
          paymentMethod, shipmentStatus, trackingNumber, createdAt, 
          shippingMethod, estimatedDeliveryDate, CreatedAt
        }`
        const data = await client.fetch(query)
        setOrders(data)
        setFilteredOrders(data)
      } catch (error) {
        toast({ title: "Error", description: "Failed to fetch orders", variant: "destructive" })
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  useEffect(() => {
    const filtered = orders.filter(
      (order) =>
        order.customer?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        order.totalPrice.toString().includes(searchTerm) ||
        order.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.shipmentStatus.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredOrders(filtered)
  }, [searchTerm, orders])

  const handleDelete = async (id: string) => {
    try {
      await axios.delete("/api/orders", { data: { orderId: id } })
      setOrders((prev) => prev.filter((order) => order._id !== id))
      toast({ title: "Success", description: "Order deleted successfully!" })
    } catch (error) {
      console.log(error)
      toast({ title: "Error", description: "Failed to delete order", variant: "destructive" })
    }
  }

  const updateShipment = async (
    id: string,
    shipmentStatus: string,
    trackingNumber: string,
    estimatedDeliveryDate: string,
  ) => {
    try {
      await axios.patch("/api/orders", { orderId: id, shipmentStatus, trackingNumber, estimatedDeliveryDate })
      setOrders((prev) =>
        prev.map((order) =>
          order._id === id ? { ...order, shipmentStatus, trackingNumber, estimatedDeliveryDate } : order,
        ),
      )
      toast({ title: "Updated", description: "Shipment status updated successfully!" })
    } catch (error) {
      console.log(error)
      toast({ title: "Error", description: "Failed to update shipment", variant: "destructive" })
    }
  }

  return (
    <div className="w-full container mx-auto p-4 lg:p-6 py-4">
   <h2 className={`font-lusitana my-8 text-2xl `}>Orders</h2>

    <SearchBar placeholder="Search customers..." value={searchTerm} onChange={setSearchTerm} />
    <div className="mt-6 flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden rounded-md bg-gray-50 p-2 md:pt-0">
              {loading ? (
                <p className="text-center py-4">Loading orders...</p>
              ) : filteredOrders.length === 0 ? (
                <p className="text-center py-4 text-gray-500">No orders found.</p>
              ) : (
                <>
                  <div className="md:hidden">
                    {filteredOrders.map((order) => (
                      <div key={order._id} className="mb-2 w-full rounded-md bg-white p-4">
                        <div className="flex  w-full items-center justify-between border-b pb-4">
                          
                            <div className="mb-1 flex w-full justify-between items-center">

                            <div className="flex w-full  flex-col  justify-between">
                              <div className="flex items-center gap-2 font-bold">
                                <p className="text-xl">
                                  {order.customer?.firstName} {order.customer?.lastName}
                                </p>
                                </div>                           
                            <p className="text-sm text-gray-500">{order.customer?.email}</p>
                              </div>

                              <div className="text-sm">
            <Button variant="destructive" className="shadow-none h-auto" onClick={() => handleDelete(order._id)}>
              <Trash2 className="h-10 w-10 text-red-600" />
            </Button>
          </div>

                           
                          </div>
                        </div>
                        <div className="mt-4 border-b pb-4">
                          <p className="text-sm font-semibold ">Items:</p>
                          {order.items.map((item, idx) => (
                            <p key={idx} className="text-sm">
                              {item.name} (x{item.quantity})
                            </p>
                          ))}
                        </div>

                        <div>

                        <div className="flex flex-col border-b py-4">
                        <p className="text-sm font-semibold ">Address:</p>
                            <p>
                          {order.address
                ? `${order.address.streetAddress}, ${order.address.area}, ${order.address.city}, ${order.address.province}, ${order.address.country} - ${order.address.zipCode}`
                : "No address provided"}
                          </p>
                          </div>
                          
                        </div>
                        <div className="border-b py-4 flex justify-between">
                          <div className="flex flex-col">
                            <p className="text-sm font-semibold ">Total Price:</p>
                            <p className="font-medium text-sm">Rs.{order.totalPrice}</p>
                            <p className="font-medium text-sm">{order.paymentMethod}</p>
                          </div>
    
                          <div >
                          <p className="text-sm font-semibold ">Shipment Status:</p>
                          <Select
                            onValueChange={(val) =>
                              updateShipment(order._id, val, order.trackingNumber || "", order.createdAt || "")
                            }
                            defaultValue={order.shipmentStatus}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                            <SelectContent className="bg-white text-black">
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="shipped">Shipped</SelectItem>
                              <SelectItem value="inTransit">In Transit</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        </div>
                        

                        <div className="max-w-20 py-4">
                          <p className=" text-sm font-semibold">Created At:</p>
                          <p className="text-sm">{order.createdAt || "Not Set"}</p>
                        </div>
                       
                      </div>
                    ))}
                  </div>
                  <table className="hidden min-w-full rounded-md text-gray-900 md:table">
                    <thead className="rounded-md bg-gray-50 text-left text-sm font-normal">
                      <tr>
                        <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                          Customer
                        </th>
                        <th scope="col" className="px-3 py-5 font-medium">
                          Items
                        </th>
                        <th scope="col" className="px-3 py-5 font-medium">
                          Address
                        </th>
                        <th scope="col" className="px-3 py-5 font-medium">
                          Total Payment
                        </th>
                        <th scope="col" className="px-3 py-5 font-medium">
                          Shipment
                        </th>
                        <th scope="col" className="px-3 py-5 font-medium">
                          Placed at
                        </th>
                        <th scope="col" className="px-3 py-5 font-medium">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-gray-900">
                      {filteredOrders.map((order) => (
                        <tr key={order._id} className="group">
                          <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black sm:pl-6">
                            <div>
                              {order.customer?.firstName} {order.customer?.lastName}
                            </div>
                            <div className="text-gray-500">{order.customer?.email}</div>
                          </td>
                          <td className="whitespace-nowrap bg-white px-3 py-5 text-sm">
                            {order.items.map((item, idx) => (
                              <div key={idx}>
                                {item.name} (x{item.quantity})
                              </div>
                            ))}
                          </td>
                          <td className="max-w-60  bg-white px-3 py-5 text-sm">
                          {order.address
                ? `${order.address.streetAddress}, ${order.address.area}, ${order.address.city}, ${order.address.province}, ${order.address.country} - ${order.address.zipCode}`
                : "No address provided"}
                          </td>
                          <td className="whitespace-nowrap bg-white px-3 py-5 text-sm">
                            <div>Rs.{order.totalPrice}</div>
                            <div className="text-gray-500">{order.paymentMethod}</div>
                          </td>
                          <td className="whitespace-nowrap bg-white px-3 py-5 text-sm">
                            <Select
                              onValueChange={(val) =>
                                updateShipment(order._id, val, order.trackingNumber || "", order.createdAt || "")
                              }
                              defaultValue={order.shipmentStatus}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select Status" />
                              </SelectTrigger>
                              <SelectContent className="bg-white text-black">
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="shipped">Shipped</SelectItem>
                                <SelectItem value="inTransit">In Transit</SelectItem>
                                <SelectItem value="delivered">Delivered</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="max-w-32  bg-white px-3 py-5 text-sm">
                            {order.createdAt || "Not Set"}
                          </td>
                          <td className="whitespace-nowrap bg-white px-3 py-5 text-sm">
                            <Button variant="destructive" onClick={() => handleDelete(order._id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
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
      </div>
    </div>
  )
}

