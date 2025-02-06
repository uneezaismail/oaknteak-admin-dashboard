import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

// GET: Fetch all orders
// export async function GET() {
//   try {
//     const query = groq`*[_type == "order"]{
//       _id, customer-> {firstName, lastName, email}, items, address, totalPrice, 
//       paymentMethod, shipmentStatus, trackingNumber, createdAt, 
//       shippingMethod, estimatedDeliveryDate
//     }`;

//     const orders = await client.fetch(query);
//     return NextResponse.json(orders, { status: 200 });
//   } catch (error) {
//     return NextResponse.json({ message: "Failed to fetch orders", error }, { status: 500 });
//   }
// }

// PATCH: Update shipment status
export async function PATCH(req: Request) {
  try {
    const { orderId, shipmentStatus, trackingNumber, estimatedDeliveryDate } = await req.json();

    await client
      .patch(orderId)
      .set({
        shipmentStatus,
        trackingNumber,
        estimatedDeliveryDate,
      })
      .commit();

    return NextResponse.json({ message: "Shipment updated successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to update shipment", error }, { status: 500 });
  }
}

// DELETE: Delete an order
export async function DELETE(req: Request) {
  try {
    const { orderId } = await req.json();
    await client.delete(orderId);
    return NextResponse.json({ message: "Order deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to delete order", error }, { status: 500 });
  }
}
