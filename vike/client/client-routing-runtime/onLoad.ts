export { onLoad }

import { assertIsBrowser } from '../../utils/assertIsBrowser'
import { assertClientRouting } from '../../utils/assertRoutingType'

function onLoad() {
  assertIsBrowser()
  // Ensure we don't bloat the Server Routing runtime with Client Routing utils
  assertClientRouting()
}
