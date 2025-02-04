export { onLoad }

import { assertIsNotBrowser } from '../../utils/assertIsNotBrowser.js'
import { assertIsNotProductionRuntime, markSetup_vikeVitePlugin } from '../../utils/assertSetup.js'
import { assertNodeVersion } from '../../utils/assertNodeVersion.js'
import { assertVersion } from '../../utils/assertVersion.js'
import { version } from 'vite'

function onLoad() {
  markSetup_vikeVitePlugin()
  assertIsNotBrowser()
  assertNodeVersion()
  // package.json#peerDependencies isn't enough as users often ignore it
  assertVersion('Vite', version, '5.1.0')
  // Ensure we don't bloat the server runtime with heavy dependencies such Vite and esbuild
  assertIsNotProductionRuntime()
}
