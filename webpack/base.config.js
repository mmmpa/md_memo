const webpack = require('webpack');
const PreBuild = require('./plugins/pre-build');

module.exports = {
  entry: {
    built: ['babel-polyfill', './src/index.js'],
    preload: ['./src/preload.js']
  },
  output: {
    publicPath: '/',
    filename: 'javascripts/[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          'babel-loader',
          // 'eslint-loader',
        ],
        exclude: /node_modules/
      },
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      'Promise': 'es6-promise',
      'jQuery': 'jquery',
      '$': "jquery"
    }),
    new webpack.DefinePlugin({
      'ENV': JSON.stringify(process.env.ENV || 'development'),
      'APPLICATION_META_INFORMATION': JSON.stringify({
        commitId: require('./commit-id'),
        buildDate: new Date().toString(),
        clientID: process.env.MD_MEMO_STORE_CLIENT_ID,
        githubOauthEndpoint: process.env.MD_MEMO_STORE_GITHUB_OAUTH,
      }),
    }),
    new PreBuild(function () {}),
  ],
  devServer: {
    historyApiFallback: {
      index: '/',
      disableDotRule: true
    },
    noInfo: true
  },
  performance: {
    hints: false
  },
};
