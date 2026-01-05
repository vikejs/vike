export { onLoad }

import { assertIsBrowser } from '../../utils/assertIsBrowser.js'
import { assertServerRouting } from '../runtime-client-routing/utils.js'

function onLoad() {
  assertIsBrowser()
  assertServerRouting()
}
