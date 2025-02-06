import { client } from "@/sanity/lib/client";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await client.delete(id);
    return NextResponse.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ message: "Failed to delete review" }, { status: 500 });
  }
}
