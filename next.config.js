module.exports = {
  reactStrictMode: true,
  webpack: function (config) {
    config.experiments = { asyncWebAssembly: true };
    config.ignoreWarnings = [
      {
        module: /zokrates-js/,
      },
    ];
    return config;
  },
};
