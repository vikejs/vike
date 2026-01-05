export { onLoad }

import { assertIsBrowser } from '../../utils/assertIsBrowser.js'
import { assertServerRouting } from '../../utils/assertRoutingType.js'

function onLoad() {
  assertIsBrowser()
  assertServerRouting()
}
