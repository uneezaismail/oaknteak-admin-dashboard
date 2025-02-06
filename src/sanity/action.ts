"use server"

import { client } from "./lib/client"

// Products
export async function getProducts() {
  const query = `*[_type == "product"] {
    _id,
    productName,
    price,
    inventory,
    description,
    "slug": slug.current,
    "category": category->name,
    "imageUrl": images[0].asset->url
  }`
  return client.fetch(query)
}

export async function getProduct(id: string) {
  const query = `*[_type == "product" && _id == $id][0]`
  return client.fetch(query, { id })
}


// Customers
export async function getCustomers() {
  const query = `*[_type == "customer"] {
    _id,
    firstName,
    lastName,
    email,
    phone
  }`
  return client.fetch(query)
}

// Orders
export async function getOrders() {
  const query = `*[_type == "order"] {
    _id,
    createdAt,
    totalPrice,
    shipmentStatus,
    "customer": customer->{firstName, lastName, email},
    items[]{
      productId,
      name,
      quantity,
      price
    }
  }`
  return client.fetch(query)
}






// export async function fetchTopSellingProducts() {
//   const query = `
//     *[_type == "order"] {
//       "items": items[] {
//         "name": name,
//         "quantity": quantity
//       }
//     } | order(_createdAt desc)[0...100]
//   `

//   const orders = await client.fetch(query)

//   const productCounts: { [key: string]: number } = {}

//   orders.forEach((order: any) => {
//     order.items.forEach((item: any) => {
//       if (productCounts[item.name]) {
//         productCounts[item.name] += item.quantity
//       } else {
//         productCounts[item.name] = item.quantity
//       }
//     })
//   })

//   const sortedProducts = Object.entries(productCounts)
//     .sort(([, a], [, b]) => b - a)
//     .slice(0, 10)
//     .map(([name, count]) => ({ name, count }))

//   return sortedProducts
// }




// const revenueQuery =`
//   *[_type == "order"]{
//     totalPrice,
//     createdAt
//   }
// `


// const fetchRevenueData = async () => {
//   const data = await client.fetch(revenueQuery)
  
//   // Prepare monthly revenue
//   const revenueData = data.reduce((acc:any, order:any) => {
//     const month = new Date(order.createdAt).toLocaleString('default', { month: 'short' }) 
//     if (!acc[month]) {
//       acc[month] = 0
//     }
//     acc[month] += order.totalPrice
//     return acc
//   }, {})

//   // Map the revenue data into the format required by the chart
//   return Object.keys(revenueData).map(month => ({
//     month,
//     revenue: revenueData[month],
//   }))
// }
