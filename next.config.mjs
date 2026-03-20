/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  serverExternalPackages: ['better-sqlite3', '@prisma/adapter-better-sqlite3'],
};

export default nextConfig;
