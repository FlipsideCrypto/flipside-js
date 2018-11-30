const path = require("path");
let version = require("./package.json").version;
let filename = `flipside-v${version}.js`;

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: filename,
    path: path.resolve(__dirname, "dist")
  },
  mode: "development",
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
      { test: /\.scss$/, use: ["style-loader", "css-loader", "sass-loader"] },
      { test: /\.svg$/, use: { loader: "url-loader" } }
    ]
  }
};
