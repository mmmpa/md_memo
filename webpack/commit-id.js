var childProcess = require('child_process');

module.exports = exec('git rev-parse HEAD');

function exec (cmd) {
  return childProcess.execSync(cmd).toString().replace(/[\n\r]/, '')
}
