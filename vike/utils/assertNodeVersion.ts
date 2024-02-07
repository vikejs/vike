export { assertNodeVersion }

import { assertUsage } from './assert.js'
import { isNodeJS } from './isNodeJS.js'
import { isVersionOrAbove } from './isVersionOrAbove.js'

// package.json#engines.node isn't enough as users can ignore it
function assertNodeVersion() {
  if (!isNodeJS()) return
  const version = process.versions.node
  assertUsage(isVersionOrAbove(version, '16.0.0'), `Node.js ${version} isn't supported, use Node.js >=16.0.0 instead.`)
}
