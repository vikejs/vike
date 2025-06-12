export { onLoad }

import { assertIsBrowser } from '../../utils/assertIsBrowser.js'
import { assertClientRouting } from '../../utils/assertRoutingType.js'

function onLoad() {
  assertIsBrowser()
  // Ensure we don't bloat the Server Routing runtime with Client Routing utils
  assertClientRouting()
}
