import { handleAuth } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest } from "next/server";

// Configure Kinde with dynamic URLs
function configureKindeUrls(request: NextRequest) {
  const host = request.headers.get("host");
  const protocol = request.headers.get("x-forwarded-proto") || "http";
  const currentUrl = `${protocol}://${host}`;

  // Set dynamic environment variables for this request
  if (process.env.VERCEL_URL) {
    process.env.KINDE_SITE_URL = `https://${process.env.VERCEL_URL}`;
    process.env.KINDE_POST_LOGIN_REDIRECT_URL = `https://${process.env.VERCEL_URL}/auth-callback`;
    process.env.KINDE_POST_LOGOUT_REDIRECT_URL = `https://${process.env.VERCEL_URL}`;
  } else if (!process.env.KINDE_SITE_URL) {
    process.env.KINDE_SITE_URL = currentUrl;
    process.env.KINDE_POST_LOGIN_REDIRECT_URL = `${currentUrl}/auth-callback`;
    process.env.KINDE_POST_LOGOUT_REDIRECT_URL = currentUrl;
  }
}

const handler = handleAuth();

export async function GET(request: NextRequest, context: any) {
  configureKindeUrls(request);
  return handler(request, context);
}

export async function POST(request: NextRequest, context: any) {
  configureKindeUrls(request);
  return handler(request, context);
}
