export { assertNodeVersion }
export { nodeVersionMin }

import { isNodeJS } from './isNodeJS.js'
import { assertVersion } from './assertVersion.js'

// Vike's minimum supported Node.js version
const nodeVersionMin = '20.19.0'

// node_modules/vike/package.json#engines.node isn't enough, as users often ignore it
function assertNodeVersion() {
  if (!isNodeJS()) return
  const version = process.versions.node
  assertVersion(
    'Node.js',
    version,
    // https://gist.github.com/brillout/8e0133716e169b981b6c4e8a938b0134
    [nodeVersionMin, '22.12.0'],
  )
}
