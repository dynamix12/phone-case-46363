import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const host = request.headers.get("host");
    const protocol = request.headers.get("x-forwarded-proto") || "http";
    const currentUrl = `${protocol}://${host}`;

    // Dynamic URL resolution
    const siteUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.KINDE_SITE_URL || currentUrl;

    const config = {
      KINDE_SITE_URL: siteUrl,
      KINDE_POST_LOGIN_REDIRECT_URL: `${siteUrl}/auth-callback`,
      KINDE_POST_LOGOUT_REDIRECT_URL: siteUrl,
      KINDE_CLIENT_ID: process.env.KINDE_CLIENT_ID ? "SET" : "NOT SET",
      KINDE_CLIENT_SECRET: process.env.KINDE_CLIENT_SECRET ? "SET" : "NOT SET",
      KINDE_ISSUER_URL: process.env.KINDE_ISSUER_URL,
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_URL: process.env.VERCEL_URL,
      CURRENT_HOST: host,
      CURRENT_URL: currentUrl,
      PROTOCOL: protocol,
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
