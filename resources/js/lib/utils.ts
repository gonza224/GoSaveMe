import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getDisplayName = (file: File, truncateLength = 10): string => {
  if (!file) return "";
  const originalName = file.name;
  const extension = originalName.split(".").pop()?.toLowerCase() || "";
  const baseName = originalName.replace(/\.[^/.]+$/, "");
  const truncatedBase =
    baseName.length > truncateLength ? baseName.slice(0, truncateLength) + "…" : baseName;

  if (extension === "pdf") {
    return `${truncatedBase.trim()}.pdf`;
  }
  return truncatedBase;
};