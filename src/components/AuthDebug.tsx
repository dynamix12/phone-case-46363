"use client";

import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useEffect, useState } from "react";

const AuthDebug = () => {
  const { user, isAuthenticated, isLoading, getToken } =
    useKindeBrowserClient();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const accessToken = await getToken();
        setToken(accessToken || "No token");
      } catch (error) {
        setToken("Error getting token");
      }
    };

    if (isAuthenticated) {
      fetchToken();
    }
  }, [isAuthenticated, getToken]);

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <div className="font-bold mb-2">Auth Debug</div>
      <div>Loading: {isLoading ? "Yes" : "No"}</div>
      <div>Authenticated: {isAuthenticated ? "Yes" : "No"}</div>
      <div>User ID: {user?.id || "None"}</div>
      <div>User Email: {user?.email || "None"}</div>
      <div>Token: {token ? "Present" : "None"}</div>
      <div>Timestamp: {new Date().toLocaleTimeString()}</div>
    </div>
  );
};

export default AuthDebug;
