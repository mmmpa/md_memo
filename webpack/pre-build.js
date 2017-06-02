function PreBuild(callback) {
  this.callback = callback;
}

PreBuild.prototype.apply = function(compiler) {
  compiler.plugin('compile', this.callback);
};

module.exports = PreBuild;
