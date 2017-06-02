const webpack = require('webpack');
const PreBuild = require('./plugins/pre-build');

module.exports = {
  entry: {
    built: ['babel-polyfill', './src/index.js'],
    preload: ['./src/preload.js']
  },
  output: {
    publicPath: 'javascripts',
    filename: '[name].js'
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
      'Promise': 'es6-promise'
    }),
    new webpack.DefinePlugin({
      'ENV': JSON.stringify(process.env.ENV || 'development'),
      'APPLICATION_META_INFORMATION': JSON.stringify({
        commitId: require('./commit-id'),
        buildDate: new Date().toString(),
      }),
    }),
    new PreBuild(function () {}),
  ],
  devServer: {
    historyApiFallback: {
      index: '/'
    },
    noInfo: true
  },
  performance: {
    hints: false
  },
};
