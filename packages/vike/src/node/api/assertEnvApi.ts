import '../../utils/trackLogs.js' // should be loaded ASAP

import { assertIsNotBrowser } from '../../utils/assertIsNotBrowser.js'
import { assertIsNotProductionRuntime } from '../../utils/assertSetup.js'

assertEnv()

function assertEnv() {
  assertIsNotBrowser()
  assertIsNotProductionRuntime()
}
