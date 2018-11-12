module.exports = {
  entry: "./src/index.js",
  mode: "development",
  output: {
    path: __dirname + "/dist",
    publicPath: "dist",
    filename: "bundle.js"
  },
  devtool: "sourcemap"
};
