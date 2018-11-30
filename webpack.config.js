const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "flipside.js",
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
