const { assert, assertUsage } = require('../dist/utils/assert.js')

assert(isNodejs())

module.exports.navigate = navigate

function navigate() {
  assertUsage(false, "[`navigate(url)`] The `navigate(ur)` funciton is only availble in the browser, but you are calling it in Node.js.")
}

function isNodejs() {
  return (typeof window === 'undefined')
}
