const path = require("path");
let version = require("./package.json").version;
let filename = `flipside-v${version}.js`;

module.exports = {
  entry: "./src/index.tsx",
  output: {
    filename: filename,
    path: path.resolve(__dirname, "dist")
  },
  mode: "development",
  devtool: "inline-source-map",
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
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
