const webpack = require('webpack');

const development = Object.assign({}, require('./base.config.js'), {

});

development.plugins = development.plugins.concat([
  new webpack.DefinePlugin({
    'APPLICATION_META_INFORMATION': JSON.stringify({
      commitId: require('./commit-id'),
      buildDate: new Date().toString(),
      clientID: process.env.MD_MEMO_STORE_DEV_CLIENT_ID,
      githubOauthEndpoint: process.env.MD_MEMO_STORE_DEV_GITHUB_OAUTH,
    }),
  })
]);

module.exports = development;
