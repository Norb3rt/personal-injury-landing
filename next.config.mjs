/** @type {import('next').NextConfig} */
const nextConfig = {
  // Recomiendo habilitar el linter y la verificación de tipos para producción
  // para asegurar la calidad del código. Si causa problemas, puedes mantenerlo como está.
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: false,
    domains: ['https://personalinjury.lawproactive.com'],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Enable compression
  compress: true,
  // 'standalone' es para despliegues en contenedores. Si usas Vercel, esto no es necesario.
  output: 'standalone',
  reactCompiler: true,
  experimental: {
    // optimizeCss: true, // Puedes probar a habilitarlo para mejorar el CSS.
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons', 'framer-motion'],
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
  // Redirects for SEO - redirect OLD URLs to new structure
  // These run BEFORE rewrites, so old URLs get redirected first
  async redirects() {
    return [
      // Static page redirects
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
      // Legacy single-city URLs (most specific first)
      {
        source: '/los-angeles',
        destination: '/personal-injury-lawyer/california/los-angeles',
        permanent: true,
      },
      {
        source: '/san-francisco',
        destination: '/personal-injury-lawyer/california/san-francisco',
        permanent: true,
      },
      {
        source: '/san-diego',
        destination: '/personal-injury-lawyer/california/san-diego',
        permanent: true,
      },
      {
        source: '/sacramento',
        destination: '/personal-injury-lawyer/california/sacramento',
        permanent: true,
      },
      {
        source: '/houston',
        destination: '/personal-injury-lawyer/texas/houston',
        permanent: true,
      },
      {
        source: '/dallas',
        destination: '/personal-injury-lawyer/texas/dallas',
        permanent: true,
      },
      {
        source: '/miami',
        destination: '/personal-injury-lawyer/florida/miami',
        permanent: true,
      },
      // Dynamic state/city URLs (with practice area)
      // More specific pattern first to avoid conflicts
      {
        source: '/:state(california|texas|florida|new-york)/:city([a-z-]+)/:practice([a-z-]+)',
        destination: '/personal-injury-lawyer/:state/:city/:practice',
        permanent: true,
      },
      // Dynamic state/city URLs (without practice area)
      {
        source: '/:state(california|texas|florida|new-york)/:city([a-z-]+)',
        destination: '/personal-injury-lawyer/:state/:city',
        permanent: true,
      },
    ]
  },
}

export default nextConfig