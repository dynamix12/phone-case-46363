import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Only skip the auth callback and setup routes, but allow CORS on logout
  const isAuthCallback = request.nextUrl.pathname.includes("/kinde_callback");
  const isAuthSetup = request.nextUrl.pathname.includes("/setup");

  if (isAuthCallback || isAuthSetup) {
    return NextResponse.next();
  }

  // Handle CORS preflight requests
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers":
          "Content-Type, Authorization, rsc, next-router-state-tree, next-url, next-router-prefetch",
        "Access-Control-Allow-Credentials": "true",
      },
    });
  }

  // For all other requests, continue with the default behavior
  const response = NextResponse.next();

  // Add CORS headers to all responses
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Credentials", "true");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, rsc, next-router-state-tree, next-url, next-router-prefetch"
  );

  return response;
}

export const config = {
  matcher: [
    // Match all request paths except for the ones starting with:
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico (favicon file)
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
