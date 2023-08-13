export { assertNodeVersion }

import { assertUsage } from './assert'
import { isNodeJS } from './isNodeJS'

// package.json#engines.node isn't enough as users can ignore it
function assertNodeVersion() {
  if (!isNodeJS()) return
  const version = process.versions.node
  const major = parseInt(version.split('.')[0]!, 10)
  assertUsage(major >= 16, `Node.js ${version} isn't supported, use Node.js >=16.0.0 instead.`)
}
