import { getDeploymentInfo } from "@/lib/config";
import { SelectUser } from "@repo/db/schema";
import { useEffect, useState } from "react";

interface ApiResponse {
  status: "success" | "error";
  data?: SelectUser[];
  message?: string;
}

export default function UsersPage() {
  const [data, setData] = useState<SelectUser[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { workerUrl } = getDeploymentInfo();
      console.log("Deployment info:", getDeploymentInfo());
      try {
        const response = await fetch(workerUrl + "/users", {
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
      }
    };

    fetchData();
  }, []);
  return (
    <div className="min-h-max min-w-max items-center justify-center border rounded-lg border-lime-600">
      <div className="p-38">
        <h1>Users Found</h1>
        <p>Users page content</p>
        {data && <div> {JSON.stringify(data, null, 2)}</div>}
      </div>
    </div>
  );
}
