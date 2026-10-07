import { getAdapterRuntime, getUniversal } from '@universal-middleware/core'
import universalVikeHandler from './universal-middleware.js'
import '../assertEnvServer.js'

// Vike is the whole server: +middleware, then Vike's pages
const handler = getUniversal(universalVikeHandler)

export default {
  fetch: (request: Request) => handler(request, {}, getAdapterRuntime('other', { params: undefined })),
}
