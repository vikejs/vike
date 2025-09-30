export { onLoad }

import { assertIsNotBrowser } from '../../utils/assertIsNotBrowser.js'
import { assertIsNotProductionRuntime, markSetup_vikeVitePlugin } from '../../utils/assertSetup.js'
import { assertNodeVersion } from '../../utils/assertNodeVersion.js'
import { version as viteVersion } from 'vite'
import { assertViteVersion } from '../../utils/assertViteVersion.js'

function onLoad() {
  markSetup_vikeVitePlugin()
  assertIsNotBrowser()
  assertNodeVersion()
  assertViteVersion(viteVersion)
  // Ensure we don't bloat the server runtime with heavy dependencies such Vite and esbuild
  assertIsNotProductionRuntime()
}
