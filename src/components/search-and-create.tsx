"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ placeholder, value, onChange }: SearchBarProps) {
  return (
    <div className="relative flex-1">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        className="pl-8 h-10 border-gray-200 border rounded-[8px] placeholder:text-gray-500 shadow-none focus:ring-0 focus:ring-custom-green focus:ring-offset-0 font-medium placeholder:font-normal focus:border-2 focus:border-custom-green"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
