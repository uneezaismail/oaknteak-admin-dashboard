"use client";
import { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import { toast } from "@/hooks/use-toast";
import { SearchBar } from "../search-and-create";

interface Customer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  totalOrders: number;
  deliveredOrders: number;
  nonDeliveredOrders: number;
  fullName?: string;
}

export default function CustomersTable() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await client.fetch(`
          *[_type == "customer"] {
            _id,
            firstName,
            lastName,
            email,
            phone,
            "totalOrders": count(*[_type == "order" && customer._ref == ^._id]),
            "orders": *[_type == "order" && customer._ref == ^._id] {
              items,
              shipmentStatus
            }
          }
        `);

        
        const processedData = data.map((customer: any) => {
          let deliveredOrders = 0;
          let nonDeliveredOrders = 0;

         
          customer.orders.forEach((order: any) => {
            const shipmentStatus = order.shipmentStatus;

            if (shipmentStatus === "delivered") {
              deliveredOrders += 1;
            }

            if (["pending", "inTransit", "shipped"].includes(shipmentStatus)) {
              nonDeliveredOrders += 1;
            }
          });

          return {
            ...customer,
            deliveredOrders,
            nonDeliveredOrders,
            fullName: `${customer.firstName} ${customer.lastName}`,
          };
        });

        setCustomers(processedData);
        setFilteredCustomers(processedData);
      } catch (error) {
        toast({ title: "Error", description: "Failed to fetch customers", variant: "destructive" });
        console.log(error)
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  useEffect(() => {
    const filtered = customers.filter(
      (customer) =>
        customer.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm) ||
        customer.totalOrders.toString().includes(searchTerm)
    );
    setFilteredCustomers(filtered);
  }, [searchTerm, customers]);

  return (
    <div className="w-full py-4">
      <h2 className={`font-lusitana my-8 text-2xl `}>Customers</h2>

      <SearchBar placeholder="Search customers..." value={searchTerm} onChange={setSearchTerm} />
      <div className="mt-6 flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden rounded-md bg-gray-50 p-2 md:pt-0">
            {loading ? (
  <p className="text-center py-4">Loading customers...</p>
) : filteredCustomers.length === 0 ? (
  <p className="text-center py-4 text-gray-500">No customers found.</p>
) : (
  <>
    <div className="md:hidden">
      {filteredCustomers.map((customer) => (
        <div key={customer._id} className="mb-2 w-full rounded-md bg-white p-4">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <div className="mb-1 flex items-center">
                <div className="flex items-center gap-2 font-bold">
                  <p className="text-xl">{customer.fullName}</p>
                </div>
              </div>
              <p className="text-sm text-gray-500">{customer.email}</p>
            </div>
          </div>
          <div className="flex w-full items-center justify-between border-b py-5">
            <div className="flex w-1/2 flex-col">
              <p className="text-sm font-medium">Fulfilled orders</p>
              <p className="font-semibold text-lg">{customer.deliveredOrders}</p>
            </div>
            <div className="flex w-1/2 flex-col">
              <p className="text-sm">Pending orders</p>
              <p className="font-semibold   text-lg">{customer.nonDeliveredOrders}</p>
            </div>
          </div>
          <div className="flex w-1/2 items-center gap-2 mt-2">
            <p className="font-semibold text-lg">{customer.totalOrders}</p>
            <p className="text-sm">Orders</p>
          </div>
        </div>
      ))}
    </div>
    <table className="hidden min-w-full rounded-md text-gray-900 md:table">
      <thead className="rounded-md bg-gray-50 text-left text-sm font-normal">
        <tr>
          <th scope="col" className="px-4 py-5 font-medium sm:pl-6">Name</th>
          <th scope="col" className="px-3 py-5 font-medium">Email</th>
          <th scope="col" className="px-3 py-5 font-medium">Phone</th>
          <th scope="col" className="px-4 py-5 font-medium">Total Orders</th>
          <th scope="col" className="px-4 py-5 font-medium">Delivered Orders</th>
          <th scope="col" className="px-4 py-5 font-medium">Non-Delivered Orders</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 text-gray-900">
        {filteredCustomers.map((customer) => (
          <tr key={customer._id} className="group">
            <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black sm:pl-6">
              {customer.fullName}
            </td>
            <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
              {customer.email}
            </td>
            <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
              {customer.phone}
            </td>
            <td className="whitespace-nowrap text-center bg-white px-4 py-5 text-sm">
              {customer.totalOrders}
            </td>
            <td className="whitespace-nowrap text-center bg-white px-4 py-5 text-sm">
              {customer.deliveredOrders}
            </td>
            <td className="whitespace-nowrap text-center bg-white px-4 py-5 text-sm">
              {customer.nonDeliveredOrders}
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
  );
}
