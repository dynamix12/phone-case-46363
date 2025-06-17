import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function GET(request: NextRequest) {
  try {
    console.log("=== DEBUG AUTH START ===");

    // Log all cookies
    const cookies = request.cookies.getAll();
    console.log("All cookies:", cookies);

    // Log headers
    const headers = Object.fromEntries(request.headers.entries());
    console.log("Headers:", headers);

    // Try to get Kinde session
    const { getUser, getAccessToken, isAuthenticated } =
      getKindeServerSession();

    console.log("Kinde session methods available:", {
      hasGetUser: typeof getUser === "function",
      hasGetAccessToken: typeof getAccessToken === "function",
      hasIsAuthenticated: typeof isAuthenticated === "function",
    });

    let user = null;
    let accessToken = null;
    let authStatus: boolean | null = false;

    try {
      user = await getUser();
      console.log("User from getUser():", user);
    } catch (error) {
      console.log("Error getting user:", error);
    }

    try {
      accessToken = await getAccessToken();
      console.log("Access token exists:", !!accessToken);
    } catch (error) {
      console.log("Error getting access token:", error);
    }

    try {
      authStatus = await isAuthenticated();
      console.log("Is authenticated:", authStatus);
    } catch (error) {
      console.log("Error checking auth status:", error);
      authStatus = null;
    }

    console.log("=== DEBUG AUTH END ===");

    return NextResponse.json({
      cookies: cookies.map((c) => ({
        name: c.name,
        value: c.value.substring(0, 20) + "...",
      })),
      user,
      accessToken: accessToken ? "EXISTS" : "NULL",
      authStatus,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Debug auth error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
