import clsx from 'clsx';
import { client } from '@/sanity/lib/client';
import { groq } from 'next-sanity';
import { RefreshCw, User } from 'lucide-react';

export default async function LatestOrders() {
  const ordersQuery = groq`
  *[_type == "order"] | order(createdAt desc) [0..4] {
    id,
    createdAt,
    totalPrice,
    shipmentStatus,
    items[] {
      name,
      price,
      quantity,
      color,
      size,
      productId
    },
    customer-> {
      firstName,
      lastName,
      email
    }
  }
`;

  async function fetchLatestOrders() {
    const orders = await client.fetch(ordersQuery);
    return orders;
  }

  const latestOrders = await fetchLatestOrders();
  
  return (
    <div className="flex w-full flex-col lg:max-w-[350px]">
      <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-2 md:p-4">
        <div className="bg-white px-2 md:px-2">
          <h2 className='font-lusitana text-zinc-600 font-bold my-2 text-center text-2xl '>
            Latest Orders
          </h2>
          {latestOrders.map((order: any, i: number) => {
            return (
              <div
                key={i}
                className={clsx(
                  'flex flex-row items-center justify-between py-4',
                  {
                    'border-t': i !== 0,
                  },
                )}
              >
                <div className="flex items-center">
                  {/* Placeholder image for order icon */}
                  <User className='size-5 mr-2 bg-gray-50 rounded'/>
                  <div className="min-w-0">
                    <p className="truncate max-w-40 text-sm font-medium md:text-base">
                      {order.items[0]?.name || "Unnamed Product"}
                    </p>
                    <p className="text-sm text-gray-500 sm:block">
                      {order.customer.email}
                    </p>
                  </div>
                </div>
                <p
                  className={`font-lusitana truncate text-sm font-medium md:text-base`}
                >
                  ${order.totalPrice}
                </p>
              </div>
            );
          })}
        </div>
        <div className="flex items-center pb-2 pt-6">
          <RefreshCw className="h-5 w-5 text-gray-500" />
          <h3 className="ml-2 text-sm text-gray-500 ">Updated just now</h3>
        </div>
      </div>
    </div>
  );
}
