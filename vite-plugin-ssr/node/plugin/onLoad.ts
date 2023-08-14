export { onLoad }

import { assertIsNotBrowser } from '../../utils/assertIsNotBrowser.mjs'
import { assertIsNotProductionRuntime } from '../../utils/assertIsNotProductionRuntime.mjs'
import { assertNodeVersion } from '../../utils/assertNodeVersion.mjs'

function onLoad() {
  assertIsNotBrowser()
  assertNodeVersion()
  // Ensure we don't bloat the server runtime with heavy plugin dependencies such as esbuild
  assertIsNotProductionRuntime()
}
