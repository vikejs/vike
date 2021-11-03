import { parse } from '@brillout/json-s'
import { hasProp, objectAssign } from '../shared/utils'
import { assert, assertUsage, getPluginError } from '../shared/utils/assert'

export { getPageContextSerializedInHtml }

function getPageContextSerializedInHtml(): {
  _pageId: string
  _pageContextRetrievedFromServer: Record<string, unknown>
  _comesDirectlyFromServer: true
} & Record<string, unknown> {
  const pageContextJson = document.getElementById('vite-plugin-ssr_pageContext')?.textContent
  assertUsage(
    pageContextJson,
    'Client-side `pageContext` missing. Make sure that `injectAssets()` is applied to the HTML, see https://vite-plugin-ssr.com/injectAssets'
  )

  const pageContext: Record<string, unknown> = parse(pageContextJson!).pageContext
  assert(hasProp(pageContext, '_pageId', 'string'))
  if ('_serverSideErrorWhileStreaming' in pageContext) {
    const err = getPluginError(
      `An error occurred on the server while rendering/streaming to HTML. Check your server logs.`
    )
    throw err
  }

  objectAssign(pageContext, {
    _pageContextRetrievedFromServer: { ...pageContext },
    _comesDirectlyFromServer: true as const
  })

  return pageContext
}
