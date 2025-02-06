import { NextResponse } from "next/server"
import { client } from "@/sanity/lib/client"

export async function GET() {
  try {
    const categories = await client.fetch(`*[_type == "category"]{
      _id,
      name
    }`)

    return NextResponse.json(categories)
  } catch (error) {
    console.error("Failed to fetch categories:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}


import { z } from "zod";

type Category = {
  _type: "category";
  name: string;
  slug: {
    _type: "slug";
    current: string;
  };
};

const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = categorySchema.parse(body);
    const slug = parsed.name.toLowerCase().replace(/\s+/g, "-");

    const newCategory: Category = {
      _type: "category",
      name: parsed.name,
      slug: {
        _type: "slug",
        current: slug,
      },
    };

    const response = await client.create(newCategory);
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error creating category", error }, { status: 400 });
  }
}