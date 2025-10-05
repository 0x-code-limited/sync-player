"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function DebugPage() {
  const { data: session } = useSession();
  const [tokenData, setTokenData] = useState<{
    rawToken: string;
    decodedToken: object;
    tokenType: string;
    tokenLength: number;
    tokenParts: number;
    isJWT: boolean;
    firstPart: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) {
      setLoading(true);
      fetch("/api/debug/token")
        .then((res) => res.json())
        .then((data) => {
          setTokenData(data);
        })
        .catch((error) => {
          console.error("Failed to fetch token:", error);
          setTokenData(null);
        })
        .finally(() => setLoading(false));
    }
  }, [session]);

  const copyToken = () => {
    if (tokenData?.rawToken) {
      navigator.clipboard.writeText(tokenData.rawToken);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold">Debug Page</h2>
      <p className="text-gray-600 dark:text-gray-400">User Token Information</p>

      <div className="mt-4 space-y-4">
        <div>
          <h3 className="text-lg font-medium">Raw Token:</h3>
          <div className="flex items-start gap-2">
            {tokenData?.rawToken && (
              <button
                onClick={copyToken}
                className="px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Copy
              </button>
            )}
            <pre className="text-gray-600 dark:text-gray-400 text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-auto max-w-full">
              {loading
                ? "Loading..."
                : tokenData?.rawToken || "No token available"}
            </pre>
          </div>
          {tokenData && (
            <div className="text-sm mt-1 text-gray-500 space-y-1">
              <p>
                Type: {tokenData.tokenType} | Is JWT:{" "}
                {tokenData.isJWT ? "Yes" : "No"}
              </p>
              <p>
                Length: {tokenData.tokenLength} | Parts: {tokenData.tokenParts}
              </p>
              <p>First part: {tokenData.firstPart}...</p>
            </div>
          )}
        </div>

        <div>
          <h3 className="text-lg font-medium">Decoded Token:</h3>
          <pre className="text-gray-600 dark:text-gray-400 text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-auto max-w-full">
            {loading
              ? "Loading..."
              : tokenData?.decodedToken
              ? JSON.stringify(tokenData.decodedToken, null, 2)
              : "No token available"}
          </pre>
        </div>
      </div>
    </div>
  );
}
