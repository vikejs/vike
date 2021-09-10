import { hasProp } from '../shared/utils'
import { assert, assertUsage } from '../shared/utils/assert'

export { getPageContextSerializedInHtml }

function getPageContextSerializedInHtml(): { _pageId: string } & Record<string, unknown> {
  assertUsage(
    '__vite_plugin_ssr__pageContext' in window,
    'Client-side `pageContext` missing. Make sure to apply `injectAssets()` to the HTML strings you generate, see https://vite-plugin-ssr.com/injectAssets'
  )

  const pageContext: Record<string, unknown> = {}
  Object.assign(pageContext, window.__vite_plugin_ssr__pageContext)
  assert(hasProp(pageContext, '_pageId', 'string'))

  return pageContext
}
declare global {
  interface Window {
    __vite_plugin_ssr__pageContext: Record<string, unknown>
  }
}
