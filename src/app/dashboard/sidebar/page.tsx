"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Package, Users, ShoppingCart, Star, Power, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useUser } from "@/context/useContext"

const menuItems = [
  { href: "/dashboard/products", icon: Package, label: "Products" },
  { href: "/dashboard/category", icon: Layers,label: "Categories"  },
  { href: "/dashboard/customers", icon: Users, label: "Customers" },
  { href: "/dashboard/orders", icon: ShoppingCart, label: "Orders" },
  { href: "/dashboard/reviews", icon: Star, label: "Reviews" },
]

const mobileMenuItems = [
  { href: "/dashboard/products", icon: Package },
  { href: "/dashboard/category", icon: Layers },
  { href: "/dashboard/customers", icon: Users },
  { href: "/dashboard/orders", icon: ShoppingCart },
  { href: "/dashboard/reviews", icon: Star },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { setUser } = useUser()

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' })
      if (response.ok) {
        setUser(null)
        router.push('/login')
      } else {
        throw new Error('Logout failed')
      }
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <div className="flex flex-col m-2 box-border h-fit md:h-[98vh] md:bg-custom-green text-white rounded-xl  md:w-[300px]">
      <div className="flex flex-row  bg-custom-green rounded-xl h-36 md:h-48 items-center justify-center md:items-end  gap-2  md:p-2 md:pb-6 border-b border-white">  
        <span className="text-4xl font-lusitana lg:text-3xl font-bold">OAK&TEAK</span>
      </div>
      <div className="flex flex-col md:h-full justify-between">
        <nav className="hidden md:flex flex-col items-start gap-3 pt-4">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href} className="w-full px-[2px]">
              <Button
                variant={pathname?.startsWith(item.href) ? "secondary" : "ghost"}
                className={cn(
                  "flex md:p-5 lg:flex-row h-auto transition-all duration-300 ease-in-out transform hover:bg-white hover:text-custom-green hover:scale-105 justify-start gap-2 w-full md:py-4 text-base border-white/20",
                  pathname?.startsWith(item.href) ? "bg-white text-custom-green" : ""
                )}
              >
                <item.icon className="!w-5 !h-5" />
                <span>{item.label}</span>
              </Button>
            </Link>
          ))}
        </nav>

        <nav className="md:hidden bg-white text-black flex flex-row lg:flex-col items-center lg:items-start gap-4">
          {mobileMenuItems.map((item) => (
            <Link key={item.href} href={item.href} className="w-full">
              <Button
                variant={pathname?.startsWith(item.href) ? "secondary" : "ghost"}
                className={cn(
                  "flex p-0 px-0 md:hidden bg-gray-50 h-auto rounded-sm mt-2 lg:flex-row items-center lg:justify-start text-2xl gap-2 w-full border-2 border-white/20 transition-all duration-300 ease-in-out transform hover:bg-emerald-50 hover:scale-105",
                  pathname?.startsWith(item.href) ? "bg-emerald-50 text-custom-green" : ""
                )}
              >
                <item.icon className="!w-5 !h-5" />
              </Button>
            </Link>
          ))}
 <Button onClick={handleLogout} variant="ghost" 
           className={cn(
            "flex p-0 px-0 md:hidden bg-gray-50 h-auto rounded-sm mt-2 lg:flex-row items-center lg:justify-start text-2xl gap-2 w-full border-2 border-white/20 transition-all duration-300 ease-in-out transform hover:bg-emerald-50 hover:scale-105",
            pathname?.startsWith("/") ? " text-custom-green" : ""
          )}>
          <Power  className="!h-6 !w-5" />
            
          </Button>
          
        </nav>

        {/* Sign Out Button (For larger screens) */}
        <div className="hidden md:block border-t p-2">
          <Button onClick={handleLogout} variant="ghost" className="flex md:px-5 lg:flex-row h-auto transition-all duration-300 ease-in-out transform hover:bg-white hover:text-custom-green hover:scale-105 justify-start gap-2 w-full md:py-2 text-base border-white/20">
          <Power className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  )
}

