/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'taste-buds.s3.amazonaws.com',
          port: '',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: 'oaidalleapiprodscus.blob.core.windows.net',
          port: '',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: '5d5c4pjklv5h18be.public.blob.vercel-storage.com',
          port: '',
        },
      ]
    },
    experimental: {
        serverActions: {
          bodySizeLimit: '5mb',
        },
      },
}

module.exports = nextConfig
