import DashboardStats from "@/components/dashboard/Cards"
import LatestOrders from "@/components/dashboard/LatestOrders"
import RevenueChart from "@/components/dashboard/RevenueChart"

export default function Dashboard() {
  return (
    <main className="w-full md:p-4 py-8">
  <h2 className={`font-lusitana my-4 text-2xl px-4`}>Dashboard</h2>
    <div className="w-full space-y-20 md:space-y-10 p-4">
      <DashboardStats/>
      <div className="flex flex-col lg:flex-row gap-y-10 md:gap-x-4">
        <div className="flex-2 ">
          <RevenueChart />
        </div>
        <div className="flex-1 ">
          <LatestOrders />
        </div>
      </div>
    </div>
    </main>
  )
}
