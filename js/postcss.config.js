module.exports = {
  plugins: [
    require("autoprefixer")({
      overrideBrowserslist: [
        "> 1%",
        "last 2 versions",
        "Firefox ESR",
        "not dead",
        "not ie 11",
      ],
      grid: "autoplace",
    }),
    require("cssnano")({
      preset: [
        "default",
        {
          discardComments: {
            removeAll: true,
          },
          normalizeWhitespace: false,
        },
      ],
    }),
  ],
};
