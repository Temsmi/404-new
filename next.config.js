/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ['en', 'tr'],
    defaultLocale: 'en',
    localeDetection: true, 
  },
};

module.exports = nextConfig;
