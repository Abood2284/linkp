import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { getSession } from "next-auth/react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// This function is used to fetch data from the server with the user's session token, so that only authenticated users can access the data.
export async function fetchWithSession(url: string, options: RequestInit = {}) {
  const session = await getSession();

  if (!session?.token) {
    throw new Error("No session found");
  }
  console.log("➡️ Session token", session.token);
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${session.token}`,
    ...options.headers,
  };

  return await fetch(url, {
    ...options,
    headers,
  });
}
