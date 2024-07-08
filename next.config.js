/** @type {import('next').NextConfig} */

const { i18n } = require('./next-i18next.config');
const path = require('node:path');

const nextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
    prependData: `@import "./base.scss";`,
  },
  images: {
    domains: ['localhost', 'res.cloudinary.com'],
    unoptimized: true,
  },
  i18n, // добавьте i18n сюда
};

module.exports = nextConfig;
