import '../assertEnvServer.js'
import vikeHandler from './universal-middleware.js'
import { universalMiddlewares } from './getUniversalMiddlewares.js'

export default {
  fetch: async (...args: Parameters<typeof vikeHandler>) =>
    (await universalMiddlewares(...args)) ?? vikeHandler(...args),
}
