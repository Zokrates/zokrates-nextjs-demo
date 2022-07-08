module.exports = {
  reactStrictMode: true,
  experimental: {
    images: {
      unoptimized: true,
    },
  },
  webpack: function (config) {
    config.experiments = { syncWebAssembly: true };
    config.ignoreWarnings = [
      {
        module: /zokrates-js/,
      },
    ];
    return config;
  },
};
