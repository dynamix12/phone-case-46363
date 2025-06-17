/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["utfs.io", "utfs.sh", "dwzfb2c1yx.ufs.sh"],
  },
  env: {
    KINDE_SITE_URL:
      process.env.KINDE_SITE_URL ??
      `https://${process.env.VERCEL_URL ?? "kalin46363.shop"}`,
    KINDE_POST_LOGOUT_REDIRECT_URL:
      process.env.KINDE_POST_LOGOUT_REDIRECT_URL ??
      `https://${process.env.VERCEL_URL ?? "kalin46363.shop"}`,
    KINDE_POST_LOGIN_REDIRECT_URL:
      process.env.KINDE_POST_LOGIN_REDIRECT_URL ??
      `https://${process.env.VERCEL_URL ?? "kalin46363.shop"}/auth-callback`,
  },
  webpack: (config, { isServer }) => {
    // Ignore Expo-specific modules that cause build issues in Next.js
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "expo-secure-store": false,
      "expo-constants": false,
      "@expo/vector-icons": false,
    };

    return config;
  },
};

export default nextConfig;
