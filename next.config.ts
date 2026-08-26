import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL(
        'https://next-pokemon-s3-bucket-627821643881-ap-southeast-2-an.s3.ap-southeast-2.amazonaws.com/**',
      ),
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
