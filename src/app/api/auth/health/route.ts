import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const host = request.headers.get("host");
    const protocol = request.headers.get("x-forwarded-proto") || "https";
    const currentUrl = `${protocol}://${host}`;

    const config = {
      // Environment variables as they actually exist
      KINDE_SITE_URL: process.env.KINDE_SITE_URL || "NOT SET",
      KINDE_POST_LOGIN_REDIRECT_URL:
        process.env.KINDE_POST_LOGIN_REDIRECT_URL || "NOT SET",
      KINDE_POST_LOGOUT_REDIRECT_URL:
        process.env.KINDE_POST_LOGOUT_REDIRECT_URL || "NOT SET",
      KINDE_CLIENT_ID: process.env.KINDE_CLIENT_ID
        ? `SET (${process.env.KINDE_CLIENT_ID.substring(0, 8)}...)`
        : "NOT SET",
      KINDE_CLIENT_SECRET: process.env.KINDE_CLIENT_SECRET ? "SET" : "NOT SET",
      KINDE_ISSUER_URL: process.env.KINDE_ISSUER_URL || "NOT SET",
      NODE_ENV: process.env.NODE_ENV || "NOT SET",
      VERCEL_URL: process.env.VERCEL_URL || "NOT SET",

      // Current request info
      CURRENT_HOST: host,
      CURRENT_URL: currentUrl,
      PROTOCOL: protocol,

      // What URLs Kinde should use
      RECOMMENDED_SITE_URL: currentUrl,
      RECOMMENDED_LOGIN_REDIRECT: `${currentUrl}/auth-callback`,
      RECOMMENDED_LOGOUT_REDIRECT: currentUrl,

      // Callback URL that should be set in Kinde
      CALLBACK_URL: `${currentUrl}/api/auth/kinde_callback`,

      // Debug info
      ALL_ENV_VARS: Object.keys(process.env)
        .filter((key) => key.includes("KINDE") || key.includes("AUTH"))
        .reduce((acc, key) => {
          acc[key] = key.includes("SECRET") ? "HIDDEN" : process.env[key];
          return acc;
        }, {} as Record<string, any>),
    };

    return NextResponse.json({
      status: "healthy",
      config,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
