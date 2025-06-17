/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["utfs.io", "utfs.sh", "dwzfb2c1yx.ufs.sh"],
  },
  env: {
    // Use Vercel URL when available, fallback to custom domain
    KINDE_SITE_URL: process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.KINDE_SITE_URL || "https://kalin46363.shop",
    KINDE_POST_LOGOUT_REDIRECT_URL: process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.KINDE_POST_LOGOUT_REDIRECT_URL || "https://kalin46363.shop",
    KINDE_POST_LOGIN_REDIRECT_URL: process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}/auth-callback`
      : process.env.KINDE_POST_LOGIN_REDIRECT_URL ||
        "https://kalin46363.shop/auth-callback",
  },
  async headers() {
    return [
      {
        // Apply these headers to all routes
        source: "/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
