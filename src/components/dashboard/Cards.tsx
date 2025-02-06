"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Banknote, Package, ShoppingCart, Users } from "lucide-react"
import { getCustomers, getOrders, getProducts } from "@/sanity/action"

export default function DashboardStats() {
  const [totalProducts, setTotalProducts] = useState(0)
  const [totalCustomers, setTotalCustomers] = useState(0)
  const [totalOrders, setTotalOrders] = useState(0)
  const [monthlyRevenue, setMonthlyRevenue] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      const products = await getProducts()
      const customers = await getCustomers()
      const orders = await getOrders()

      setTotalProducts(products.length)
      setTotalCustomers(customers.length)
      setTotalOrders(orders.length)

      // Calculate This Month's Revenue
      const currentMonth = new Date().getMonth()
      const revenue = orders
        .filter((order:any) => new Date(order.createdAt).getMonth() === currentMonth)
        .reduce((sum:any, order:any) => sum + order.totalPrice, 0)

      setMonthlyRevenue(revenue)
    }

    fetchData()
  }, [])

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard  title="Total Products"  value={totalProducts} icon={<Package className="h-5 w-5" />} />
      <StatCard title="Total Customers" value={totalCustomers} icon={<Users className="h-5 w-5" />} />
      <StatCard title="Total Orders" value={totalOrders} icon={<ShoppingCart className="h-5 w-5" />} />
      <StatCard title="This Month's Revenue" value={`Rs ${monthlyRevenue}`} icon={<Banknote className="h-5 w-5" />} />
    </div>
  )
}

const StatCard = ({ title, value, icon }: { title: string; value: string | number; icon: React.ReactNode }) => {
  return (
    <Card className="border-none p-2 min-h-[150px]  md:min-h-[100px] bg-gray-50">
      <CardHeader className="flex flex-row items-center  gap-x-2 space-y-0 md:py-2">
      {icon}
        <CardTitle className="text-base font-medium ">{title}</CardTitle>
       
      </CardHeader>
      <CardContent className="min-h-[100px] content-center bg-white rounded">
        <p className="text-2xl text-center py-2 h-full font-semibold">{value}</p>
      </CardContent>
    </Card>
  )
}
