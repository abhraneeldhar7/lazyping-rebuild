import { clsx, type ClassValue } from "clsx"
import { toast } from "sonner";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    toast.message("Copied to clipboard")
  } catch (err) {
    toast.error("Failed to copy")
  }
}

export function compareObjects(a: any, b: any) {
  if (a === b) return true;

  // Handle null & primitive mismatch
  if (a === null || b === null) return a === b;
  if (typeof a !== "object" || typeof b !== "object") return false;

  // Handle Date
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }

  // Handle Array
  if (Array.isArray(a) !== Array.isArray(b)) return false;

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!Object.prototype.hasOwnProperty.call(b, key)) return false;
    if (!compareObjects(a[key], b[key])) return false;
  }

  return true;
}

export function formatRelativeTime(date: Date | string | null): string {
  if (!date) return "Never";
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return `${seconds}s ago`;
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export function serialize(data: any): string {
  return JSON.stringify(data);
}

export function deserialize<T>(data: string | null): T | null {
  if (!data) return null;
  return JSON.parse(data, (key, value) => {
    // Attempt to convert ISO date strings back to Date objects
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value)) {
      return new Date(value);
    }
    // Handle simplified ISO without milliseconds if necessary, though Date.toISOString() uses them.
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
      const d = new Date(value);
      if (!isNaN(d.getTime())) return d;
    }
    return value;
  }) as T;
}