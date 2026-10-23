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
        source: '/dahilde-isleme-islemleri',
        destination: '/hizmetlerimiz/dahilde-isleme',
        permanent: true,
      },
      {
        source: '/dahilde-ve-haricte-isleme-rejimi',
        destination: '/hizmetlerimiz/dahilde-isleme',
        permanent: true,
      },
      {
        source: '/hizmetlerimiz/dahilde-haricte-isleme',
        destination: '/hizmetlerimiz/dahilde-isleme',
        permanent: true,
      },
      {
        source: '/haricte-isleme-hizmetleri',
        destination: '/hizmetlerimiz/haricte-isleme',
        permanent: true,
      },
      {
        source: '/antrepo-rejimi-islemleri',
        destination: '/hizmetlerimiz/antrepo',
        permanent: true,
      },
      {
        source: '/antrepo-ve-transit-rejimi',
        destination: '/hizmetlerimiz/antrepo',
        permanent: true,
      },
      {
        source: '/hizmetlerimiz/antrepo-transit',
        destination: '/hizmetlerimiz/antrepo',
        permanent: true,
      },
      {
        source: '/transit-rejimi',
        destination: '/hizmetlerimiz/transit',
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
      {
        source: '/hukuk-hizmetleri',
        destination: '/hizmetlerimiz/hukuk',
        permanent: true,
      },
      {
        source: '/sigorta-hizmetleri',
        destination: '/hizmetlerimiz/sigorta',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
