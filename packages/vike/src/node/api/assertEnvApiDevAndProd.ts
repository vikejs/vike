import '../../utils/trackLogs.js' // should be loaded ASAP

import { assertIsNotBrowser } from '../../utils/assertIsNotBrowser.js'

assertEnvApiDevAndProd()

function assertEnvApiDevAndProd() {
  assertIsNotBrowser()
  /* It's expected that users programmtically trigger the pre-rendering process in production (it's a common technique), we therefore tolerate `import { prerender } from 'vike/api'` in production. This means that, in this case, we tolerate the `vite` package to be loaded in production (we usually prevent users to do that).
  assertIsNotProductionRuntime()
  */
}
