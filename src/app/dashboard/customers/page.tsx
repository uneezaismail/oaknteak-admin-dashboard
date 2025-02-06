// import { Suspense } from "react"
// import { CustomerList } from "@/components/customers/customer-list"
// import { CustomerListSkeleton } from "@/components/customers/customer-list-skeleton"

import CustomerTable from "@/components/customers/customerTable";

// export default function CustomersPage() {
//   return (
//     <div className="flex flex-col gap-6">
//       <h1 className="text-3xl font-bold">Customers</h1>
//       <Suspense fallback={<CustomerListSkeleton />}>
//         <CustomerList />
//       </Suspense>
//     </div>
//   )
// }




export default function CustomersPage() {
  return (
    <div className="container mx-auto p-6">
      <CustomerTable />
    </div>
  );
}

