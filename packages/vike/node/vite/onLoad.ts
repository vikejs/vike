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
  // This assertion isn't reliable: the user may still use a Vite version older than 6.0.0 — see https://github.com/vitejs/vite/pull/19355
  // TO-DO/eventually: let's also use this.meta.viteVersion
  // - https://github.com/vitejs/vite/pull/20088
  // - https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md#700-2025-06-24
  assertVersion('Vite', version, '6.0.0')
  // Ensure we don't bloat the server runtime with heavy dependencies such Vite and esbuild
  assertIsNotProductionRuntime()
}
