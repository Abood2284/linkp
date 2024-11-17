"use client";

import { useEffect, useState } from "react";
import { SelectProduct } from "@repo/db/schema";
import { getWorkerUrl } from "@/lib/config";

export const runtime = "edge";
interface ApiResponse {
  status: "success" | "error";
  data?: SelectProduct[];
  message?: string;
}

export default function Home() {
  const [data, setData] = useState<SelectProduct[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        // Get the appropriate worker URL for the current environment
        const workerUrl = getWorkerUrl();
        console.log("Using worker URL:", workerUrl);

        const response = await fetch(workerUrl, {
          // Include credentials if your API requires authentication
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: ApiResponse = await response.json();

        setData(result.data || null);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch data");
      }
    };

    fetchData();
  }, []);

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Database Test</h1>
      {data && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Products:</h2>
          <pre className="bg-gray-100 text-black p-4 rounded-lg overflow-x-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </main>
  );
}
