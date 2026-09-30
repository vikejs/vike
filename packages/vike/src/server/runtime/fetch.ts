import '../assertEnvServer.js'
import { pipe } from '@universal-middleware/core'
import vikeHandler from './universal-middleware.js'
import { universalMiddlewares } from './getUniversalMiddlewares.js'

export default {
  fetch: pipe(universalMiddlewares, vikeHandler),
}
