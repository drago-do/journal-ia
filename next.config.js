/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  //add images of any origin
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  //Agregar variable de entorno
  env: {
    API_URL: "http://localhost:3001",
    UNSPLASH_KEY: process.env.UNSPLASH_KEY,
  },
};

module.exports = nextConfig;
