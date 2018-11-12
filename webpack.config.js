module.exports = {
  entry: "./src/index.js",
  mode: "development",
  output: {
    path: __dirname + "/dist",
    publicPath: "dist",
    filename: "bundle.js"
  },
  devtool: "sourcemap",
  node: {
    fs: 'empty'
  },
};


// this is in the “plugins” array part of our webpack object
    // next 3 lines added to remove warnings....might be a problem
