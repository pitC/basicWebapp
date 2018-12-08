var path = require("path");
var webpack = require("webpack");

module.exports = {
  entry: ["babel-polyfill", "whatwg-fetch", "./public/js/vueapp.js"],
  output: {
    path: path.resolve(__dirname, "./public/dist"),
    publicPath: "./dist/",
    filename: "build.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/
      }
    ]
  }
};
