import type { NextConfig } from "next";

// Rewrites are resolved when `next build` / `next dev` starts, so API_URL must
// be set at build time for production images. Locally it comes from .env.local.
const apiUrl = process.env.API_URL ?? "http://localhost:3001";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async rewrites() {
    return [
      {
        // Browser calls /api/tasks; Next.js proxies it to the NestJS API.
        source: "/api/:path*",
        destination: `${apiUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
