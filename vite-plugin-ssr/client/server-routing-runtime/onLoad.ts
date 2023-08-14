export { onLoad }

import { assertIsBrowser } from '../../utils/assertIsBrowser.mjs'

function onLoad() {
  assertIsBrowser()
}
