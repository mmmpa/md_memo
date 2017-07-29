const webpack = require('webpack');

const CompressionPlugin = require("compression-webpack-plugin");

const production = Object.assign({}, require('./base.config.js'), {
  output: {
    filename: 'public/javascripts/[name].js'
  },
  devtool: false
});

production.plugins = production.plugins.concat([
  new webpack.DefinePlugin({
    'APPLICATION_META_INFORMATION': JSON.stringify({
      commitId: require('./commit-id'),
      buildDate: new Date().toString(),
      clientID: process.env.MD_MEMO_STORE_CLIENT_ID,
      githubOauthEndpoint: process.env.MD_MEMO_STORE_GITHUB_OAUTH,
    }),
  }),
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
