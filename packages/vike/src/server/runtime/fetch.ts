import '../assertEnvServer.js'
import vikeHandler from './universal-middleware.js'
import { universalMiddlewares } from './getUniversalMiddlewares.js'

export default {
  fetch: async (...args: Parameters<typeof vikeHandler>) => {
    const result = await universalMiddlewares(...args)
    if (result instanceof Response) return result
    const response = await vikeHandler(...args)
    return result ? result(response) : response
  },
}
