/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "lastfm.freetls.fastly.net",
      "lastfm-img.freetls.fastly.net",
    ],
  },
};

module.exports = nextConfig;
