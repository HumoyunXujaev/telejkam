const { i18n } = require('./next-i18next.config');
const path = require('node:path');

const nextConfig = {
  api: {
    bodyParser: {
      sizeLimit: '20mb', // Increase to 10MB or higher based on your needs
    },
    responseLimit: false,
  },
  experimental: {
    esmExternals: true,
  },
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
        source: '/dashboard/:path*',
        has: [
          {
            type: 'host',
            value: 'admin.telejkam.uz',
          },
        ],
        destination: '/admin/dashboard/:path*',
      },
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'admin.telejkam.uz',
          },
        ],
        destination: '/admin/:path*',
      },
      {
        source: '/:path*',
        destination: '/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
