import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  redirects() {
    return [{ source: "/favicon.ico", destination: "/icon", permanent: false }];
  },
};

export default nextConfig;
