import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
  serverExternalPackages: ["@react-pdf/renderer"],
  // Ensure hand-designed proposal closing pages are bundled for the PDF route.
  outputFileTracingIncludes: {
    "/api/proposals/[id]/pdf": ["./assets/proposal-pages/**/*"],
  },
};

export default nextConfig;
