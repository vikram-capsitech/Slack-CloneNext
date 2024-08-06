/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'capsitech.blob.core.windows.net',
          },
        ],
      },
};

export default nextConfig;
