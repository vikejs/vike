export { onLoad }

import { assertIsBrowser } from '../../utils/assertIsBrowser.js'

function onLoad() {
  assertIsBrowser()
}
