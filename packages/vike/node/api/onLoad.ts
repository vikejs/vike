export { onLoad }

import { assertIsNotBrowser } from '../../utils/assertIsNotBrowser.js'
import { assertIsNotProductionRuntime } from '../../utils/assertSetup.js'

function onLoad() {
  assertIsNotBrowser()
  assertIsNotProductionRuntime()
}
