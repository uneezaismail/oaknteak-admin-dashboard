
import { SidebarProvider } from "@/components/ui/sidebar";
import Sidebar from "@/app/dashboard/sidebar/page";

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SidebarProvider>
      <div className="flex flex-col md:flex-row font-inter bg-white md:max-h-svh overflow-hidden w-full">
        <Sidebar />
        <main className="w-full h-full overflow-y-auto">
          <div>{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
