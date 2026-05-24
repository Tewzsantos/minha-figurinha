import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.vercel-storage.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
  },
  // Allow sharp to run in serverless functions
  serverExternalPackages: ['sharp'],
}

export default nextConfig
