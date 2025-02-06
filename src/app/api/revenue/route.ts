import { client } from "@/sanity/lib/client"
import { NextResponse } from "next/server"


export async function GET() {
  const query = `
    *[_type == "order"] {
      totalPrice,
      createdAt
    }
  `

  try {
    const orders = await client.fetch(query)

    const revenueByMonth: { [key: string]: number } = {}

    orders.forEach((order: { totalPrice: number; createdAt: string }) => {
      const date = new Date(order.createdAt)
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`

      if (!revenueByMonth[monthYear]) {
        revenueByMonth[monthYear] = 0
      }

      revenueByMonth[monthYear] += order.totalPrice
    })

    const sortedRevenue = Object.entries(revenueByMonth)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, revenue]) => ({ month, revenue }))

    return NextResponse.json(sortedRevenue)
  } catch (error) {
    console.error("Error fetching revenue data:", error)
    return NextResponse.json({ error: "Error fetching revenue data" }, { status: 500 })
  }
}

