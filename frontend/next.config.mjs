/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3000/:path*',
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/dashboard',
        destination: '/app/dashboard',
        permanent: true,
      },
      {
        source: '/proposal/:id',
        destination: '/app/proposal/:id',
        permanent: true,
      },
      {
        source: '/receipt/:id',
        destination: '/app/receipt/:id',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
