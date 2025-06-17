import { NextResponse } from "next/server";

export async function GET() {
  try {
    const config = {
      KINDE_SITE_URL: process.env.KINDE_SITE_URL,
      KINDE_POST_LOGIN_REDIRECT_URL: process.env.KINDE_POST_LOGIN_REDIRECT_URL,
      KINDE_POST_LOGOUT_REDIRECT_URL:
        process.env.KINDE_POST_LOGOUT_REDIRECT_URL,
      KINDE_CLIENT_ID: process.env.KINDE_CLIENT_ID ? "SET" : "NOT SET",
      KINDE_CLIENT_SECRET: process.env.KINDE_CLIENT_SECRET ? "SET" : "NOT SET",
      KINDE_ISSUER_URL: process.env.KINDE_ISSUER_URL,
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_URL: process.env.VERCEL_URL,
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
