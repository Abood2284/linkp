"use client";

import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function SessionDebug() {
  const { data: session, status } = useSession();
  const [isVisible, setIsVisible] = useState(false);

  // Debug function to check if cookie exists
  const checkSessionCookie = () => {
    const cookies = document.cookie.split(";");
    const sessionCookie = cookies.find(
      (cookie) =>
        cookie.trim().startsWith("next-auth.session-token=") ||
        cookie.trim().startsWith("__Secure-next-auth.session-token=")
    );
    return sessionCookie ? true : false;
  };

  const testApiCall = async () => {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      console.log("Testing API call with token:", session?.token);

      const res = await fetch(`${API_BASE_URL}/api/user/me`, {
        headers: {
          ...(session?.token
            ? { Authorization: `Bearer ${session.token}` }
            : {}),
        },
        credentials: "include",
      });

      const data = await res.json();
      console.log("API test response:", data);
      alert(`API response: ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      console.error("API test failed:", error);
      alert(`API test failed: ${error}`);
    }
  };

  if (!isVisible) {
    return (
      <Button
        className="fixed bottom-4 right-4 z-50"
        size="sm"
        variant="outline"
        onClick={() => setIsVisible(true)}
      >
        Debug
      </Button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-white border rounded-md shadow-lg max-w-md z-50">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium">Session Debug</h3>
        <Button variant="ghost" size="sm" onClick={() => setIsVisible(false)}>
          Close
        </Button>
      </div>

      <div className="space-y-2 text-xs">
        <div>
          <div className="font-medium">Status:</div>
          <div>{status}</div>
        </div>

        <div>
          <div className="font-medium">User:</div>
          <div>{session?.user?.name || "Not logged in"}</div>
        </div>

        <div>
          <div className="font-medium">Email:</div>
          <div>{session?.user?.email || "N/A"}</div>
        </div>

        <div>
          <div className="font-medium">User ID:</div>
          <div>{session?.user?.id || "N/A"}</div>
        </div>

        <div>
          <div className="font-medium">User Type:</div>
          <div>{session?.user?.userType || "N/A"}</div>
        </div>

        <div>
          <div className="font-medium">Token Available:</div>
          <div>{session?.token ? "Yes" : "No"}</div>
        </div>

        <div>
          <div className="font-medium">Session Cookie Exists:</div>
          <div>{checkSessionCookie() ? "Yes" : "No"}</div>
        </div>

        <div className="pt-2">
          <Button size="sm" onClick={testApiCall}>
            Test API Call
          </Button>
        </div>
      </div>
    </div>
  );
}
