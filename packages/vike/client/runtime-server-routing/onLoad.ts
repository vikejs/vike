console.log('client/runtime-server-routing/onLoad.ts')
export { onLoad }

import { assertIsBrowser } from '../../utils/assertIsBrowser.js'

function onLoad() {
  console.log('onLoad()')
  assertIsBrowser()
}
