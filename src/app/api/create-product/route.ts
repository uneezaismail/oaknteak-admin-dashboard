
import { type NextRequest, NextResponse } from "next/server"
import { client } from "@/sanity/lib/client"
import { v4 as uuidv4 } from "uuid"


const generateShortId = () => {
  const fullUuid = uuidv4()
  return fullUuid.replace(/-/g, "").substring(0, 4) 
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const productName = formData.get("productName") as string
    const description = formData.get("description") as string
    const price = Number.parseFloat(formData.get("price") as string)
    const category = formData.get("category") as string
    const tags = formData.getAll("tags") as string[]
    const discountPercentage = Number.parseFloat(formData.get("discountPercentage") as string) || 0
    const colors = formData.getAll("colors") as string[]
    const sizes = formData.getAll("sizes") as string[]
    const inventory = Number.parseInt(formData.get("inventory") as string) || 0
    const material = formData.get("material") as string
    const dimensions = formData.get("dimensions") as string
    const weight = formData.get("weight") as string
    const images = formData.getAll("images") as File[]

    if (images.length < 2 || images.length > 4) {
      return NextResponse.json({ error: "Please upload between 2 and 4 images." }, { status: 400 })
    }

    const imageAssets = await Promise.all(
      images.map(async (image) => {
        const bytes = await image.arrayBuffer()
        const buffer = Buffer.from(bytes)

        const asset = await client.assets.upload("image", buffer, {
          filename: `${uuidv4()}-${image.name}`,
        })

        return {
          _key: uuidv4(),
          _type: "image",
          asset: { _type: "reference", _ref: asset._id },
        }
      }),
    )

    const productId = generateShortId()

    const product = await client.create({
      _type: "product",
      product_id: productId,
      productName,
      slug: {
        _type: "slug",
        current: productName
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w-]+/g, "")
          .replace(/--+/g, "-")
          .replace(/^-+/, "")
          .replace(/-+$/, ""),
      },
      description,
      price,
      category: {
        _type: "reference",
        _ref: category,
      },
      tags,
      discountPercentage,
      colors,
      sizes,
      inventory,
      material,
      dimensions,
      weight,
      images: imageAssets,
    })

    return NextResponse.json({ success: true, product })
  } catch (error) {
    console.error("Product creation error:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
    }

    await client.delete(id)

    return NextResponse.json({ success: true, message: "Product deleted successfully" })
  } catch (error) {
    console.error("Product deletion error:", error)
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const formData = await req.formData();
    const id = formData.get("id") as string;

    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const updateData: any = {};

    // Add fields to update with proper type handling
    const fields = [
      "productName",
      "description",
      "price",
      "category",
      "tags",
      "discountPercentage",
      "colors",
      "sizes",
      "inventory",
      "material",
      "dimensions",
      "weight",
    ];

    fields.forEach((field) => {
      const value = formData.get(field);
      if (value !== null) {
        if (field === "price" || field === "discountPercentage" || field === "inventory") {
          updateData[field] = Number(value);
        } else if (field === "tags" || field === "colors" || field === "sizes") {
          updateData[field] = (value as string).split(",").map((item) => item.trim());
        } else if (field === "category") {
          updateData[field] = { _type: "reference", _ref: value as string }; // Convert category to a reference
        } else {
          updateData[field] = value;
        }
      }
    });
    

    // Handle images separately if new images are uploaded
    const images = formData.getAll("images") as File[];
    if (images.length > 0) {
      const imageAssets = await Promise.all(
        images.map(async (image) => {
          const bytes = await image.arrayBuffer();
          const buffer = Buffer.from(bytes);

          const asset = await client.assets.upload("image", buffer, {
            filename: `${uuidv4()}-${image.name}`,
          });

          return {
            _key: uuidv4(),
            _type: "image",
            asset: { _type: "reference", _ref: asset._id },
          };
        })
      );
      updateData.images = imageAssets;
    }

    // Update the product in Sanity
    const updatedProduct = await client.patch(id).set(updateData).commit();

    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (error) {
    console.error("Product update error:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

