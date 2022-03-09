import { parse } from '@brillout/json-s/parse'
import { hasProp, objectAssign, assert, assertUsage, getProjectError } from './utils'

export { getPageContextSerializedInHtml }

function getPageContextSerializedInHtml(): {
  _pageId: string
  _pageContextRetrievedFromServer: Record<string, unknown>
  _comesDirectlyFromServer: true
} {
  const pageContextJson = document.getElementById('vite-plugin-ssr_pageContext')?.textContent
  assertUsage(
    pageContextJson,
    'Client-side `pageContext` missing. Make sure that `injectAssets()` is applied to the HTML, see https://vite-plugin-ssr.com/injectAssets',
  )

  const parseResult = parse(pageContextJson)
  assert(hasProp(parseResult, 'pageContext', 'object'))
  const { pageContext } = parseResult
  assert(hasProp(pageContext, '_pageId', 'string'))
  if ('_serverSideErrorWhileStreaming' in pageContext) {
    const err = getProjectError(
      `An error occurred on the server while rendering/streaming to HTML. Check your server logs.`,
    )
    throw err
  }

  objectAssign(pageContext, {
    _pageContextRetrievedFromServer: { ...pageContext },
    _comesDirectlyFromServer: true as const,
  })

  return pageContext
}
