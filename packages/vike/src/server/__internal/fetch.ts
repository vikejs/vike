import '../assertEnvServer.js'
import { vikeUniversalMiddleware } from '../runtime/universal-middleware/vikeUniversalMiddleware.js'

export default {
  fetch: vikeUniversalMiddleware,
}
