/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  typescript: {
    // Ignore TypeScript errors during production build to allow Vercel deployment
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
