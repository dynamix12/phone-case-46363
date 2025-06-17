import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function middleware(request: NextRequest) {
  // Skip middleware for static files and Next.js internals
  if (
    request.nextUrl.pathname.startsWith("/_next/") ||
    request.nextUrl.pathname.startsWith("/api/auth/") ||
    request.nextUrl.pathname.includes(".") ||
    request.nextUrl.pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // Public paths that don't require authentication
  const publicPaths = ["/", "/api/uploadthing", "/api/webhooks"];

  if (publicPaths.includes(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  try {
    // Try to get the user session
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    // If no user, redirect to login for protected routes
    if (!user) {
      const loginUrl = new URL("/api/auth/login", request.url);
      loginUrl.searchParams.set("post_login_redirect_url", request.url);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  } catch (error) {
    // If there's an error getting the session, redirect to login
    const loginUrl = new URL("/api/auth/login", request.url);
    loginUrl.searchParams.set("post_login_redirect_url", request.url);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: [
    // Match all paths except static files and API routes
    "/((?!_next/static|_next/image|favicon.ico|api/auth|api/uploadthing|api/webhooks).*)",
  ],
};
