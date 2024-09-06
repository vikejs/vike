export { renderPage, renderPageWeb }

import { renderPage as _renderPage } from 'vike/server'
import type { VikeHttpResponse, VikeOptions } from './types.js'

async function renderPage<PlatformRequest>({
  url,
  headers,
  options,
  platformRequest
}: {
  url: string
  headers: [string, string][]
  options: VikeOptions<PlatformRequest>
  platformRequest: PlatformRequest
}): Promise<VikeHttpResponse> {
  function getPageContext(platformRequest: PlatformRequest): Record<string, any> {
    return typeof options.pageContext === 'function' ? options.pageContext(platformRequest) : options.pageContext ?? {}
  }

  const pageContext = await _renderPage({
    urlOriginal: url,
    headersOriginal: headers,
    ...(await getPageContext(platformRequest))
  })

  if (pageContext.errorWhileRendering) {
    options.onError?.(pageContext.errorWhileRendering)
  }

  return pageContext.httpResponse
}

async function renderPageWeb<PlatformRequest>({
  url,
  headers,
  platformRequest,
  options
}: {
  url: string
  headers: [string, string][]
  platformRequest: PlatformRequest
  options: VikeOptions<PlatformRequest>
}) {
  const httpResponse = await renderPage({
    url,
    headers,
    platformRequest,
    options
  })
  if (!httpResponse) return undefined
  const { statusCode, headers: headersOut, getReadableWebStream } = httpResponse
  return new Response(getReadableWebStream(), { status: statusCode, headers: headersOut })
}
