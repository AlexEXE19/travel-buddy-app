import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // Serve images directly (no optimizer) — avoids sharp issues on Alpine,
    // so /public/images/*.png render reliably in the container.
    unoptimized: true,
  },
}

export default nextConfig
