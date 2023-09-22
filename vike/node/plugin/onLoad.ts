export { onLoad }

import { assertIsNotBrowser } from '../../utils/assertIsNotBrowser.js'
import { assertIsNotProductionRuntime } from '../../utils/assertIsNotProductionRuntime.js'
import { assertNodeVersion } from '../../utils/assertNodeVersion.js'

function onLoad() {
  assertIsNotBrowser()
  assertNodeVersion()
  // Ensure we don't bloat the server runtime with heavy plugin dependencies such as esbuild
  assertIsNotProductionRuntime()
}
