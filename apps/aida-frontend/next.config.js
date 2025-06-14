/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // 添加图片域名配置
  images: {
    domains: ['picsum.photos', 'images.unsplash.com'],
  },
  // 确保生产环境中的路由处理
  trailingSlash: false,
};

module.exports = nextConfig;
