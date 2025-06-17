import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";
import { NextRequest } from "next/server";

export default withAuth(
  async function middleware(req: NextRequest) {
    // Optional: Add custom logic here after authentication
    console.log("Auth middleware running for:", req.nextUrl.pathname);
  },
  {
    isReturnToCurrentPage: true,
    publicPaths: ["/", "/api/uploadthing", "/api/webhooks"],
  }
);

export const config = {
  matcher: [
    // Run on everything but Next.js internals and static files
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
