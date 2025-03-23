const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const webpack = require("webpack");
module.exports = (env) => {
  return {
    entry: {
      index: "./public/script.js",
      login: "./public/scripts/login.js",
      register: "./public/scripts/register.js",
      newPoll: "./public/scripts/newPoll.js",
      pollVoting: "./public/scripts/poll-voting.js",
      analytics: "./public/scripts/analytics.js",
    },
    mode: env.prod ? "production" : "development",
    plugins: [
      new HtmlWebpackPlugin({
        template: "index.html",
        inject: true,
        chunks: ["index", "newPoll"],
        filename: "index.html",
      }),
      new HtmlWebpackPlugin({
        template: "./public/auth/login.html",
        inject: true,
        chunks: ["login"],
        filename: "./public/auth/login.html",
      }),
      new HtmlWebpackPlugin({
        template: "./public/auth/register.html",
        inject: true,
        chunks: ["register"],
        filename: "./public/auth/register.html",
      }),
      new HtmlWebpackPlugin({
        template: "./public/vote/index.html",
        inject: true,
        chunks: ["pollVoting"],
        filename: "./public/vote/index.html",
      }),
      new HtmlWebpackPlugin({
        template: "./public/analytics/index.html",
        inject: true,
        chunks: ["analytics"],
        filename: "./public/analytics/index.html",
      }),
      new Dotenv({
        path: `./.env`,
      }),
      // telling the wepack how to minified the styles files.
      new MiniCssExtractPlugin({
        filename: "public/[name].css",
        ignoreOrder: false,
        chunkFilename: "[name]",
      }),
      // telling the webpack to copy our assets from src directory to build directory (dist)
      // if there is not assets in the below directory it will throw error.
      // new CopyWebpackPlugin({
      //   patterns: [
      //     {
      //       from: "src/assets/images/",
      //       to: "assets/images/",
      //     },
      //     {
      //       from: "src/assets/docs/",
      //       to: "assets/docs/",
      //     },
      //   ],
      // }),
    ],
    devServer: env.prod
      ? {}
      : {
          static: {
            directory: path.join(__dirname, "dist"),
          },
          hot: true,
          port: 8080,
          open: true,
        },
    output: {
      path: path.resolve(__dirname, "./dist"),
      clean: true,
      filename: "[name].js",
    },
    module: {
      rules: [
        {
          test: /\.(?:js|mjs|cjs)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: [["@babel/preset-env"]],
            },
          },
        },
        {
          test: /\.css$/i,
          use: [
            { loader: "style-loader" },
            { loader: "css-loader" },
            { loader: "postcss-loader" },
          ],
        },
        {
          test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
          type: "asset",
        },
      ],
    },
  };
};
