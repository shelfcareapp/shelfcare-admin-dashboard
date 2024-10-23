const nextIntlPlugin = require('next-intl/plugin');

const withNextIntl = nextIntlPlugin('./i18n.js');

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true
  },

  experimental: {
    serverComponentsExternalPackages: ['oslo']
  },

  webpack: (config) => {
    config.externals.push('@node-rs/argon2', '@node-rs/bcrypt');
    return config;
  }
};

module.exports = withNextIntl(nextConfig);
