/** @type {import('next').NextConfig} */

const { i18n } = require('./next-i18next.config');
const path = require('node:path');

const nextConfig = {
  experimental: { esmExternals: true },
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
    prependData: `@import "./base.scss";`,
  },
  images: {
    domains: ['localhost', 'res.cloudinary.com'],
    unoptimized: true,
  },
  i18n,

  async rewrites() {
    return [
      {
        source: '/dashboard',
        has: [
          {
            type: 'host',
            value: 'admin.telejkam.uz',
          },
        ],
        destination: '/admin/dashboard', // обрабатывайте админку на субдомене
      },
      {
        source: '/:path*',
        destination: '/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
