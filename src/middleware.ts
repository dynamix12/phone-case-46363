import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Handle CORS preflight requests
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "https://kalin46363.shop",
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
  response.headers.set(
    "Access-Control-Allow-Origin",
    "https://kalin46363.shop"
  );
  response.headers.set("Access-Control-Allow-Credentials", "true");

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
