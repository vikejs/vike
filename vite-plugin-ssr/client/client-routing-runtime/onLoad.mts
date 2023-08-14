export { onLoad }

import { assertIsBrowser } from '../../utils/assertIsBrowser.mjs'
import { assertClientRouting } from '../../utils/assertRoutingType.mjs'

function onLoad() {
  assertIsBrowser()
  // Ensure we don't bloat the Server Routing runtime with Client Routing utils
  assertClientRouting()
}
