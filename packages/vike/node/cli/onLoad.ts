export { onLoad }

import { assertIsNotBrowser } from '../../utils/assertIsNotBrowser.js'
import { assertIsNotProductionRuntime } from '../runtime/utils.js'

function onLoad() {
  assertIsNotBrowser()
  assertIsNotProductionRuntime()
}
