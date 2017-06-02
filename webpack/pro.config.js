const webpack = require('webpack');

const CompressionPlugin = require("compression-webpack-plugin");

const production = Object.assign({}, require('./base.config.js'), {
  output: {
    filename: 'public/javascripts/[name].js'
  },
  devtool: false
});

production.plugins = production.plugins.concat([
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    }
  }),
  new CompressionPlugin({
    asset: "[path].gz[query]",
    algorithm: "gzip",
    test: /\.js$/,
    threshold: 0,
    minRatio: 0.8
  }),
]);

module.exports = production;
