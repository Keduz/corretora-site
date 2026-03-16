/** @type {import('next').NextConfig} */
const isGithubPages = process.env.GITHUB_PAGES === 'true';

const nextConfig = {
  output: 'export',
  basePath: isGithubPages ? '/corretora-site' : '',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
