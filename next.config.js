/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // https://github.com/chartjs/Chart.js/issues/10673#issuecomment-1248543069
  // Desligar o minify resolve o bug do chartjs em build de produção
  // FIXME: a gente tem que achar outro workaround
  swcMinify: false,
  serverRuntimeConfig:{
    API_URL: process.env.API_URL
  },
  publicRuntimeConfig:{
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL
  }
};

module.exports = nextConfig;
