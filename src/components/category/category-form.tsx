"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import axios from "axios"

const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
})

type CategoryFormValues = z.infer<typeof categorySchema>

export default function CategoryForm({ onCategoryAdded }: { onCategoryAdded: () => void }) {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<CategoryFormValues>({
      resolver: zodResolver(categorySchema),
    });
  
    const [loading, setLoading] = useState(false);
  
    const onSubmit = async (data: CategoryFormValues) => {
      setLoading(true);
      try {
        await axios.post("/api/categories", data);
        toast({ title: "Success", description: "Category added successfully!", variant: "default" });
        reset();
        onCategoryAdded(); 
      } catch (error) {
        toast({ title: "Error", description: "Failed to add category", variant: "destructive" });
        console.log(error)
      }
      setLoading(false);
    };
  
    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input placeholder="Category Name" {...register("name")} />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        <Button type="submit" disabled={loading}>{loading ? "Adding..." : "Add Category"}</Button>
      </form>
    );
  }
  