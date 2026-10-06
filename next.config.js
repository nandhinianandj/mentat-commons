/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/mewe-anchors',
        destination: '/narrative?node=write-meta-reminders',
        permanent: true,
      },
      {
        source: '/road2mewe',
        destination: '/narrative?node=write-road2mewe',
        permanent: true,
      },
      {
        source: '/road2mewe-v2',
        destination: '/narrative?node=write-road2mewe-v2',
        permanent: true,
      },
      {
        source: '/road2mewe-v3',
        destination: '/narrative?node=write-road2mewe-v3',
        permanent: true,
      },
      {
        source: '/one-road-maybe-two',
        destination: '/narrative?node=write-one-road-maybe-two',
        permanent: true,
      },
      {
        source: '/what-not-to-do',
        destination: '/narrative?node=write-what-not-to-do',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
