export { onLoad }

import { assertIsNotBrowser } from '../../utils/assertIsNotBrowser'
import { assertIsNotProductionRuntime } from '../../utils/assertIsNotProductionRuntime'
import { assertNodeVersion } from '../../utils/assertNodeVersion'

function onLoad() {
  assertIsNotBrowser()
  assertNodeVersion()
  // Ensure we don't bloat the server runtime with heavy plugin dependencies such as esbuild
  assertIsNotProductionRuntime()
}
