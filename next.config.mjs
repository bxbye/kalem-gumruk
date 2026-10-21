/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      // Eski WordPress linkleri için SEO 301 yönlendirmeleri
      {
        source: '/ithalat-islemleri',
        destination: '/hizmetlerimiz/ithalat',
        permanent: true,
      },
      {
        source: '/ihracat-islemleri',
        destination: '/hizmetlerimiz/ihracat',
        permanent: true,
      },
      {
        source: '/dahilde-ve-haricte-isleme-rejimi',
        destination: '/hizmetlerimiz/dahilde-haricte-isleme',
        permanent: true,
      },
      {
        source: '/antrepo-ve-transit-rejimi',
        destination: '/hizmetlerimiz/antrepo-transit',
        permanent: true,
      },
      {
        source: '/serbest-bolge-islemleri',
        destination: '/hizmetlerimiz/serbest-bolge',
        permanent: true,
      },
      {
        source: '/danismanlik-hizmetleri',
        destination: '/hizmetlerimiz/danismanlik',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
