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
        source: '/admin/:path*',
        has: [
          {
            type: 'host',
            value: 'www.telejkam.uz',
          },
        ],
        destination: 'https://admin.telejkam.uz/:path*',
      },
      {
        source: '/:path*',
        destination: '/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
