/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["*"],
  },
  //Agregar variable de entorno
  env: {
    API_URL: "http://localhost:3001",
  },
};

module.exports = nextConfig;
