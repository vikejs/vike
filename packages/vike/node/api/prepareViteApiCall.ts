export { prepareViteApiCall }

import type { ApiOptions, ApiOperation } from './types.js'
import { clearContextVikeApiOperation, setContextVikeApiOperation } from './context.js'
import { clearGlobalContext } from '../runtime/globalContext.js'
import { getViteApiArgsWithOperation, resolveViteConfigFromUser } from './resolveViteConfigFromUser.js'

async function prepareViteApiCall(options: ApiOptions, operation: ApiOperation) {
  clear()
  setContextVikeApiOperation(operation, options)
  const viteConfigFromUserVikeApiOptions = options.viteConfig
  const viteApiArgs = getViteApiArgsWithOperation(operation)
  return resolveViteConfigFromUser(viteConfigFromUserVikeApiOptions, viteApiArgs)
}

// For subsequent API calls, e.g. calling prerender() after build()
function clear() {
  clearContextVikeApiOperation()
  clearGlobalContext()
}
