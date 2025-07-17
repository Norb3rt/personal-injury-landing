/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: false, // Enable image optimization for better performance
    domains: ['your-domain.com', 'your-strapi-instance.strapiapp.com'],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Enable compression
  compress: true,
  // Generate static pages at build time for better SEO
  output: 'standalone',
  // Optimize for production
  swcMinify: true,
  // Disable experimental features that cause build issues
  experimental: {
    // optimizeCss: true, // Disabled - causes 'critters' module error on Vercel
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  // Headers for security and SEO
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ]
  },
  // Redirects for SEO
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/index',
        destination: '/',
        permanent: true,
      },
      // Legacy city redirects to new state/city structure
      {
        source: '/los-angeles',
        destination: '/california/los-angeles',
        permanent: true,
      },
      {
        source: '/san-francisco',
        destination: '/california/san-francisco',
        permanent: true,
      },
      {
        source: '/san-diego',
        destination: '/california/san-diego',
        permanent: true,
      },
      {
        source: '/sacramento',
        destination: '/california/sacramento',
        permanent: true,
      },
      {
        source: '/houston',
        destination: '/texas/houston',
        permanent: true,
      },
      {
        source: '/dallas',
        destination: '/texas/dallas',
        permanent: true,
      },
      {
        source: '/miami',
        destination: '/florida/miami',
        permanent: true,
      },
      // Add more redirects for all your cities...
    ]
  },
}

export default nextConfig