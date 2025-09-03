export { assertNodeVersion }

import { isNodeJS } from './isNodeJS.js'
import { assertVersion } from './assertVersion.js'

// node_modules/vike/package.json#engines.node isn't enough as users can ignore it
function assertNodeVersion() {
  if (!isNodeJS()) return
  const version = process.versions.node
  assertVersion('Node.js', version, '22.12.0')
}
