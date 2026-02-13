import '../../utils/trackLogs.js' // should be loaded ASAP

import { assertIsNotBrowser } from '../../utils/assertIsNotBrowser.js'
import { assertIsNotProductionRuntime } from '../../utils/assertSetup.js'

assertEnvCli()

function assertEnvCli() {
  assertIsNotBrowser()
  assertIsNotProductionRuntime()
}
