const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const { PurgeCSSPlugin } = require("purgecss-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { GenerateSW } = require("workbox-webpack-plugin");
const glob = require("glob");

module.exports = (env) => {
  const isProduction = env === "production";

  return {
    mode: isProduction ? "production" : "development",
    entry: {
      main: "./js/index.js",
      styles: "./assets/css/main.scss",
    },
    output: {
      filename: isProduction ? "js/[name].[contenthash].js" : "js/[name].js",
      path: path.resolve(__dirname, "dist"),
      clean: true,
      assetModuleFilename: "assets/[path][name][ext][query]",
      publicPath: "/",
    },
    devServer: {
      static: {
        directory: path.join(__dirname, "dist"),
      },
      compress: true,
      port: 3000,
      hot: false,
      liveReload: false,
      open: false,
      historyApiFallback: true,
      client: {
        logging: "none",
        overlay: false,
      },
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
              plugins: [
                "@babel/plugin-transform-class-properties",
                "@babel/plugin-transform-private-methods",
                "@babel/plugin-transform-private-property-in-object",
              ],
            },
          },
        },
        {
          test: /\.(scss|css)$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
              options: {
                sourceMap: !isProduction,
              },
            },
            {
              loader: "postcss-loader",
              options: {
                sourceMap: !isProduction,
              },
            },
            {
              loader: "sass-loader",
              options: {
                sourceMap: !isProduction,
                sassOptions: {
                  quietDeps: true,
                  silenceDeprecations: ["legacy-js-api"],
                },
              },
            },
          ],
        },
        {
          test: /\.(png|jpe?g|gif|svg|ico|webp)$/i,
          type: "asset/resource",
          generator: {
            filename: "assets/images/[name].[hash][ext]",
          },
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: "asset/resource",
          generator: {
            filename: "assets/fonts/[name].[hash][ext]",
          },
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: isProduction
          ? "css/[name].[contenthash].css"
          : "css/[name].css",
      }),
      new HtmlWebpackPlugin({
        template: "./index.html",
        filename: "index.html",
        inject: "body",
        minify: isProduction
          ? {
              removeComments: true,
              collapseWhitespace: true,
              removeRedundantAttributes: true,
              useShortDoctype: true,
              removeEmptyAttributes: true,
              removeStyleLinkTypeAttributes: true,
              keepClosingSlash: true,
              minifyJS: true,
              minifyCSS: true,
              minifyURLs: true,
            }
          : false,
      }),
      ...(isProduction
        ? [
            new PurgeCSSPlugin({
              paths: glob.sync([
                path.join(__dirname, "**/*.html"),
                path.join(__dirname, "components/**/*.html"),
                path.join(__dirname, "pages/**/*.html"),
                path.join(__dirname, "js/**/*.js"),
              ]),
              safelist: {
                standard: [
                  /^btn/,
                  /^fs-/,
                  /^m-/,
                  /^p-/,
                  /^img-/,
                  /^lazy/,
                  /^dark/,
                  /^skip-/,
                  /^site-/,
                  /^main-/,
                  /^hero/,
                  /^card/,
                  /^service/,
                  /^program/,
                  /^container/,
                  /^section/,
                  /^footer/,
                  /^header/,
                ],
                deep: [/modal/, /dropdown/, /accordion/, /nav/, /menu/],
                greedy: [/data-/, /aria-/],
              },
            }),
            new GenerateSW({
              clientsClaim: true,
              skipWaiting: true,
              exclude: [/\.map$/, /manifest$/, /\.htaccess$/],
              runtimeCaching: [
                {
                  urlPattern: /\.(?:png|jpg|jpeg|svg|webp|gif|ico)$/,
                  handler: "CacheFirst",
                  options: {
                    cacheName: "images",
                    expiration: {
                      maxEntries: 100,
                      maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
                    },
                  },
                },
                {
                  urlPattern: /\.(?:js|css)$/,
                  handler: "StaleWhileRevalidate",
                  options: {
                    cacheName: "static-resources",
                  },
                },
              ],
            }),
          ]
        : []),
    ],
    optimization: {
      minimize: isProduction,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: isProduction,
              drop_debugger: isProduction,
            },
            format: {
              comments: false,
            },
          },
          extractComments: false,
        }),
        new CssMinimizerPlugin(),
      ],
      splitChunks: {
        chunks: "all",
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            chunks: "all",
          },
          common: {
            name: "common",
            minChunks: 2,
            chunks: "all",
            enforce: true,
          },
        },
      },
    },
    resolve: {
      extensions: [".js", ".json"],
      alias: {
        "@": path.resolve(__dirname, "js"),
        "@styles": path.resolve(__dirname, "assets/css"),
        "@assets": path.resolve(__dirname, "assets"),
      },
    },
    devtool: isProduction ? "source-map" : "eval-source-map",
  };
};
