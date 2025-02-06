// components/RevenueChart.tsx

// import { fetchRevenue } from "@/sanity/action";

// import { Card } from "../ui/card";
// import { CalendarIcon } from "lucide-react";
// import { generateYAxis } from "@/lib/utils";

// export default async function RevenueChart() {
//   const revenue:any = await fetchRevenue();

//   if (!revenue || revenue.length === 0) {
//     return <p className="mt-4 text-gray-400">No data available.</p>;
//   }

//   const chartHeight = 350;
//   const { yAxisLabels, topLabel } = generateYAxis(revenue);

//   return (
//     <div className="w-full md:col-span-4">
//       <Card>
//         <h2 className="mb-4 text-xl md:text-2xl">Recent Revenue</h2>
//         <div className="rounded-xl bg-gray-50 p-4">
//           <div className="sm:grid-cols-13 mt-0 grid grid-cols-12 items-end gap-2 rounded-md bg-white p-4 md:gap-4">
//             <div
//               className="mb-6 hidden flex-col justify-between text-sm text-gray-400 sm:flex"
//               style={{ height: `${chartHeight}px` }}
//             >
//               {yAxisLabels.map((label:any) => (
//                 <p key={label}>{label}</p>
//               ))}
//             </div>

//             {revenue.map((month:any) => (
//               <div key={month.month} className="flex flex-col items-center gap-2">
//                 <div
//                   className="w-full rounded-md bg-blue-300"
//                   style={{
//                     height: `${(chartHeight / topLabel) * month.revenue}px`,
//                   }}
//                 ></div>
//                 <p className="-rotate-90 text-sm text-gray-400 sm:rotate-0">
//                   {month.month}
//                 </p>
//               </div>
//             ))}
//           </div>
//           <div className="flex items-center pb-2 pt-6">
//             <CalendarIcon className="h-5 w-5 text-gray-500" />
//             <h3 className="ml-2 text-sm text-gray-500">Last 12 months</h3>
//           </div>
//         </div>
//       </Card>
//     </div>
//   );
// }



// "use client"

// import { fetchTopSellingProducts } from "@/sanity/action"
// import { useEffect, useState } from "react"
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"


// type ProductData = {
//   name: string
//   count: number
// }

// export default function OrderChart() {
//   const [data, setData] = useState<ProductData[]>([])

//   useEffect(() => {
//     fetchTopSellingProducts().then(setData)
//   }, [])

//   return (
//     <ResponsiveContainer width="100%" height={400}>
//       <BarChart data={data}>
//         <CartesianGrid strokeDasharray="3 3" />
//         <XAxis dataKey="name" />
//         <YAxis />
//         <Tooltip />
//         <Bar dataKey="count" fill="#8884d8" />
//       </BarChart>
//     </ResponsiveContainer>
//   )
// }













"use client"
"use client"

import type React from "react"
import { Bar } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"
import { useEffect, useState } from "react"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface RevenueData {
  month: string
  revenue: number
}

const options = {
  responsive: true,
  maintainAspectRatio: false, // This allows the chart to grow properly
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Monthly Revenue",
      font: {
        size: 20,
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: "Revenue (rs)",
      },
    },
  },
}

const RevenueChart: React.FC = () => {
  const [revenueData, setRevenueData] = useState<RevenueData[]>([])

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const response = await fetch("/api/revenue")
        if (!response.ok) {
          throw new Error("Failed to fetch revenue data")
        }
        const data = await response.json()
        setRevenueData(data)
      } catch (error) {
        console.error("Error fetching revenue data:", error)
      }
    }

    fetchRevenueData()
  }, [])

  const data = {
    labels: revenueData.map((item) => item.month),
    datasets: [
      {
        label: "Revenue",
        data: revenueData.map((item) => item.revenue),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  }

  return (
    <div className="p-2 md:p-4 bg-gray-100 rounded-[8px] w-full ">
      <div className="rounded-[8px] w-full h-[300px] sm:w-[400px] md:w-[600px] bg-white lg:h-[400px]">
      <Bar options={options} data={data} />
      </div>
    </div>
  )
}

export default RevenueChart
