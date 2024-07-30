await import('./src/env.js');

/** @type {import("next").NextConfig} */
const config = {
  images: {
    remotePatterns: [{ hostname: 'res.cloudinary.com' }],
  },
  async rewrites() {
    return [
      {
        source: '/verify/:token',
        destination: '/api/verify/:token',
      },
    ];
  },
};

export default config;
