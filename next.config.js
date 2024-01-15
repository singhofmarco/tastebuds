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
      ]
    },
    experimental: {
        serverActions: {
          bodySizeLimit: '5mb',
        },
      },
}

module.exports = nextConfig
