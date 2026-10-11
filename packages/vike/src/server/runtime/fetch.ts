import '../assertEnvServer.js'
import { vikeUniversalMiddleware } from './universal-middleware/vikeUniversalMiddleware.js'

export default {
  fetch: vikeUniversalMiddleware,
}
