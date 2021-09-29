// We use `package.json#dependencies['webpack'] ==="^4.0.0"` because wrangler runs webpack 4 in the background
const webpack = require("webpack");

module.exports = {
  entry: "./worker/index.js",
  target: "webworker",
  resolve: {
    mainFields: ["main", "module"],
    alias: {},
  },
  node: { fs: "empty" },
  plugins: [
    new webpack.DefinePlugin({
      IS_CLOUDFLARE_WORKER: JSON.stringify(true),
    }),
  ],
};
