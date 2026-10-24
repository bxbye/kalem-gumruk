import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const BACKEND_URL = process.env.BACKEND_INTERNAL_URL || "http://localhost:5001";

const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: [
        "kalemgumruk.com",
        "*.kalemgumruk.com",
        "kalem-gumruk.onrender.com",
        "*.onrender.com",
        "*.trycloudflare.com",
        "localhost:3000",
        "127.0.0.1:3000",
      ],
    },
  },
  turbopack: {
    root: path.resolve(__dirname, ".."),
  },
  outputFileTracingRoot: path.resolve(__dirname, ".."),
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5001",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "5001",
        pathname: "/uploads/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${BACKEND_URL}/api/:path*`,
      },
      {
        source: "/uploads/:path*",
        destination: `${BACKEND_URL}/uploads/:path*`,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:all*(svg|jpg|png|webp|avif|ico|pdf)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // Hızlı Teklif yönlendirmeleri
      {
        source: "/teklif",
        destination: "/tr/hizmetlerimiz#teklif",
        permanent: false,
      },
      {
        source: "/teklif-al",
        destination: "/tr/hizmetlerimiz#teklif",
        permanent: false,
      },
      {
        source: "/mevzuat",
        destination: "/tr/sirkuler",
        permanent: true,
      },
      {
        source: "/mevzuatlar",
        destination: "/tr/sirkuler",
        permanent: true,
      },
      // Eski WordPress linkleri için SEO 301 doğrudan yönlendirmeleri
      {
        source: "/ithalat-islemleri",
        destination: "/tr/hizmetlerimiz/ithalat",
        permanent: true,
      },
      {
        source: "/ihracat-islemleri",
        destination: "/tr/hizmetlerimiz/ihracat",
        permanent: true,
      },
      {
        source: "/dahilde-isleme-islemleri",
        destination: "/tr/hizmetlerimiz/dahilde-isleme",
        permanent: true,
      },
      {
        source: "/dahilde-ve-haricte-isleme-rejimi",
        destination: "/tr/hizmetlerimiz/dahilde-isleme",
        permanent: true,
      },
      {
        source: "/hizmetlerimiz/dahilde-haricte-isleme",
        destination: "/tr/hizmetlerimiz/dahilde-isleme",
        permanent: true,
      },
      {
        source: "/haricte-isleme-hizmetleri",
        destination: "/tr/hizmetlerimiz/haricte-isleme",
        permanent: true,
      },
      {
        source: "/antrepo-rejimi-islemleri",
        destination: "/tr/hizmetlerimiz/antrepo",
        permanent: true,
      },
      {
        source: "/antrepo-ve-transit-rejimi",
        destination: "/tr/hizmetlerimiz/antrepo",
        permanent: true,
      },
      {
        source: "/hizmetlerimiz/antrepo-transit",
        destination: "/tr/hizmetlerimiz/antrepo",
        permanent: true,
      },
      {
        source: "/transit-rejimi",
        destination: "/tr/hizmetlerimiz/transit",
        permanent: true,
      },
      {
        source: "/serbest-bolge-islemleri",
        destination: "/tr/hizmetlerimiz/serbest-bolge",
        permanent: true,
      },
      {
        source: "/danismanlik-hizmetleri",
        destination: "/tr/hizmetlerimiz/danismanlik",
        permanent: true,
      },
      {
        source: "/hukuk-hizmetleri",
        destination: "/tr/hizmetlerimiz/hukuk",
        permanent: true,
      },
      {
        source: "/sigorta-hizmetleri",
        destination: "/tr/hizmetlerimiz/sigorta",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
