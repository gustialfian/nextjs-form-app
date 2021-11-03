module.exports = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/",
        destination: "/form",
        permanent: true,
      },
    ];
  },
};
