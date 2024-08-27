import type { VikeOptions } from './types.js'
import { parseHeaders } from './utils/header-utils.js'
import { renderPageWeb } from './vike-handler.js'

export function createHandler<PlatformRequest>(options: VikeOptions<PlatformRequest> = {}) {
  return async function handler({ request, platformRequest }: { request: Request; platformRequest: PlatformRequest }) {
    if (request.method !== 'GET') {
      return undefined
    }
    return renderPageWeb({ url: request.url, headers: parseHeaders(request.headers), platformRequest, options })
  }
}
