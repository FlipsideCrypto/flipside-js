const path = require("path");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const version = require("./package.json").version;
const filename = `flipside-v${version}.js`;

module.exports = {
  entry: "./src/index.tsx",
  output: {
    filename: filename,
    chunkFilename: `flipside-[name]-v${version}.js`,
    path: path.resolve(__dirname, "dist")
  },
  mode: "development",
  devtool: "inline-source-map",
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  // plugins: [new BundleAnalyzerPlugin()],
  module: {
    rules: [
      { test: /\.tsx?$/, use: "ts-loader", exclude: /node_modules/ },
      { test: /\.js$/, loader: "babel-loader", exclude: /node_modules/ },
      { test: /\.scss$/, use: ["style-loader", "css-loader", "sass-loader"] },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          "css-modules-typescript-loader",
          { loader: "css-loader", options: { modules: true } }
        ]
      },
      { test: /\.svg$/, use: { loader: "url-loader" } }
    ]
  }
};
