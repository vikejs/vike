import '../assertEnvServer.js'
import { vikeUniversalMiddleware } from './vikeUniversalMiddleware.js'

export default {
  fetch: vikeUniversalMiddleware,
}
