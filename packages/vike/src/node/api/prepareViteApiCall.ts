export { prepareViteApiCall }

import type { ApiOptions, ApiOperation } from './types.js'
import { clearContextVikeApiOperation, setContextVikeApiOperation } from '../../shared-server-node/api-context.js'
import { clearGlobalContext } from '../../server/runtime/globalContext.js'
import { resolveViteConfigFromUser } from './resolveViteConfigFromUser.js'
import './assertEnvApi.js'

async function prepareViteApiCall(options: ApiOptions, operation: ApiOperation) {
  clear()
  setContextVikeApiOperation(operation, options)
  return resolveViteConfigFromUser()
}

// For subsequent API calls, e.g. calling prerender() after build()
function clear() {
  clearContextVikeApiOperation()
  clearGlobalContext()
}
