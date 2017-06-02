const webpack = require('webpack');

const development = Object.assign({}, require('./base.config.js'), {

});

development.plugins = development.plugins.concat([
  new webpack.DefinePlugin({
    
  })
]);

module.exports = development;
