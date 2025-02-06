import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


// utils.ts or another appropriate file
export const generateYAxis = (data: { revenue: number }[]) => {
  const maxRevenue = Math.max(...data.map((month) => month.revenue));
  const step = Math.ceil(maxRevenue / 5); // Number of steps on the Y-axis

  const yAxisLabels = [];
  for (let i = 0; i <= maxRevenue; i += step) {
    yAxisLabels.push(i);
  }

  return { yAxisLabels, topLabel: maxRevenue };
};
