"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "../search-and-create";
import CategoryForm from "./category-form";
import { client } from "@/sanity/lib/client";
import { Plus } from "lucide-react";

interface Category {
  _id: string;
  name: string;
  image: string;
}

export default function CategoryTable() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);

  const fetchCategories = async () => {
    try {
      const query = `*[_type == "category"]{
        _id,
        name,    
      }`;
      const result = await client.fetch(query);
      setCategories(result);
      setFilteredCategories(result);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const filtered = categories.filter(
      (category) =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCategories(filtered);
  }, [searchTerm, categories]);

  return (
    <section className="w-full p-4">
        <div>
      <h2 className={`font-lusitana my-8 text-2xl `}>Categories</h2>

        {isFormVisible ? (
          <CategoryForm onCategoryAdded={() => setIsFormVisible(false)} />
        ) : (
          <>
            <div className="flex justify-between gap-4 items-center mb-6">
              <SearchBar
                placeholder="Search categories..."
                value={searchTerm}
                onChange={setSearchTerm}
              />
              <Button
                className="bg-custom-green hover:bg-emerald-950 hover:text-white text-white rounded-[8px] h-auto py-[10px] font-medium"
                onClick={() => setIsFormVisible(!isFormVisible)}
              >
                Create Category
                <Plus />
              </Button>
            </div>

            <div className="overflow-x-auto mt-6">
              <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden rounded-md bg-gray-50 p-2 md:pt-0">
                  <table className="min-w-full rounded-md text-gray-900">
                    <thead className="rounded-md bg-gray-50 text-left text-sm font-normal">
                      <tr>
                        <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                          Category Name
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200 text-gray-900">
                      {filteredCategories.map((category) => (
                        <tr key={category._id}>
                          <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black sm:pl-6">
                            {category.name}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
