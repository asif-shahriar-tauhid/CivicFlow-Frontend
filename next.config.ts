import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    formats: ["image/webp", "image/avif"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  async rewrites() {
    let backendUrl =
      process.env.BACKEND_INTERNAL_URL ||
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      "https://civic-flow-api.vercel.app";

    // Vercel serverless edge forbids proxying to private hostnames (localhost).
    // If deployed or in production with a localhost env, use the live deployed API.
    const isVercelOrProd =
      process.env.VERCEL === "1" ||
      Boolean(process.env.VERCEL_ENV) ||
      process.env.NODE_ENV === "production";

    if (
      isVercelOrProd &&
      (backendUrl.includes("localhost") || backendUrl.includes("127.0.0.1"))
    ) {
      backendUrl = "https://civic-flow-api.vercel.app";
    }

    const cleanUrl = backendUrl.replace(/\/+$/, "").replace(/\/api\/v1$/, "");

    return [
      {
        source: "/api/v1/:path*",
        destination: `${cleanUrl}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;

