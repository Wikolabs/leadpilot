/** @type {import('next').NextConfig} */
const BACKEND_URL = process.env.BACKEND_URL || "http://backend:8000";

const nextConfig = {
  basePath: "/offers/leadpilot/demo",
  output: "standalone",
  // Proxy /api/* vers le backend FastAPI (évite les soucis CORS en dev).
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${BACKEND_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
