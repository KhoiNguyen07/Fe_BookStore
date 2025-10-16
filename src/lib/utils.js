import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Build full image URL. If `path` is already an absolute URL, return as-is.
export function buildImageUrl(path) {
  if (!path) return "";
  // already absolute
  if (typeof path === "string" && /^(https?:)?\/\//.test(path)) return path;
  // ensure leading slash
  const base = "http://localhost:8080";
  if (path.startsWith("/")) return base + path;
  return base + "/" + path;
}
