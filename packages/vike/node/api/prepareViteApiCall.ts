export { prepareViteApiCall }

import type { ApiOptions, ApiOperation } from './types.js'
import { clearContextVikeApiOperation, setContextVikeApiOperation } from '../../shared-server-node/api-context.js'
import { clearGlobalContext } from '../../server/runtime/globalContext.js'
import { getViteContextWithOperation, resolveViteConfigFromUser } from './resolveViteConfigFromUser.js'

async function prepareViteApiCall(options: ApiOptions, operation: ApiOperation) {
  clear()
  setContextVikeApiOperation(operation, options)
  const viteConfigFromUserVikeApiOptions = options.viteConfig
  const viteContext = getViteContextWithOperation(operation)
  return resolveViteConfigFromUser(viteConfigFromUserVikeApiOptions, viteContext)
}

// For subsequent API calls, e.g. calling prerender() after build()
function clear() {
  clearContextVikeApiOperation()
  clearGlobalContext()
}
