// apps/linkp-website/lib/functions/auth-fetcher.ts
import { getSession } from "next-auth/react";

// A specialized fetcher that works with SWR's expected types
export const authFetcher = async <T>(url: string): Promise<T> => {
  if (!url) throw new Error("URL is required");

  console.log(`Auth Fetcher: URL: ${url} Starting`);

  try {
    // Get the session to extract authentication token
    const session = await getSession();
    const token = session?.token;
    console.log("🔑[auto-fetcher.ts] Retrieved token:", token);

    console.log(
      `Auth Fetcher: Session found: ${!!session}, Token available: ${!!token}`
    );

    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
    console.log("📤[auto-fetcher.ts] Request headers:", headers);

    // Make the request with authentication headers if available
    const res = await fetch(url, {
      headers,
      credentials: "include", // Include cookies in the request
    });
    console.log(`Auth Fetcher: URL: ${url} Status: ${res.status}`);

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Auth Fetcher: URL: ${url} Error: ${errorText}`);
      throw new Error(`API error: ${res.status}`);
    }

    const data = await res.json();
    console.log(`Auth Fetcher: URL: ${url} Data received successfully`);
    return data as T; // Cast to the expected type
  } catch (error) {
    console.error(`Auth Fetcher: URL: ${url} Error:`, error);
    throw error;
  }
};
