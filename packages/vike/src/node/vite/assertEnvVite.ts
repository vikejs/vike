import '../../utils/trackLogs.js' // should be loaded ASAP

import { assertIsNotBrowser } from '../../utils/assertIsNotBrowser.js'
import { assertIsNotProductionRuntime, markSetup_vikeVitePlugin } from '../../utils/assertSetup.js'
import { assertNodeVersion } from '../../utils/assertNodeVersion.js'
import { version as viteVersion } from 'vite'
import { assertViteVersion } from '../../utils/assertViteVersion.js'
import { installUncaughtErrorHandlers } from '../../utils/installUncaughtErrorHandlers.js'

assertEnvVite()
onLoad()

function assertEnvVite() {
  markSetup_vikeVitePlugin()
  assertIsNotBrowser()
  assertNodeVersion()
  assertViteVersion(viteVersion) // Early check — more reliable check using `this.meta.viteVersion` later
  assertIsNotProductionRuntime() // Don't bloat server with heavy dependencies like Vite
}

function onLoad() {
  installUncaughtErrorHandlers()
}
