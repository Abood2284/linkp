import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { APIResponse } from "../../../packages/db/src/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function fetchAPI<T>(
  url: string,
  options?: RequestInit
): Promise<APIResponse<T>> {
  const response = await fetch(url, options);

  // Ensure the response is properly parsed as your APIResponse type
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const json: APIResponse<T> = await response.json();
  return json;
}


