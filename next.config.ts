/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: {
    appIsrStatus: true,
  },
  allowedDevOrigins: ['127.0.0.1'],
  turbopack: {},
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ysqtkuboydtivbcwwtqg.supabase.co',
        pathname: '/storage/v1/object/public/portfolio-images/**',
      },
    ],
  },
};

module.exports = nextConfig;