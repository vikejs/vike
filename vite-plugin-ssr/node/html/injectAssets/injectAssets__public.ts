export { injectAssets__public }

import { assertUsage, assertWarning, castProp, hasProp } from '../../utils'
import { injectHtmlTagsToString } from '../injectAssets'
import type { PageAsset } from '../../renderPage/getPageAssets'

// TODO: remove this on next semver major
async function injectAssets__public(htmlString: string, pageContext: Record<string, unknown>): Promise<string> {
  assertWarning(false, '`_injectAssets()` is deprecated and will be removed.', { onlyOnce: true, showStackTrace: true })
  assertUsage(
    typeof htmlString === 'string',
    '[injectAssets(htmlString, pageContext)]: Argument `htmlString` should be a string.'
  )
  assertUsage(pageContext, '[injectAssets(htmlString, pageContext)]: Argument `pageContext` is missing.')
  const errMsg = (body: string) =>
    '[injectAssets(htmlString, pageContext)]: ' +
    body +
    '. Make sure that `pageContext` is the object that `vite-plugin-ssr` provided to your `render(pageContext)` hook.'
  assertUsage(hasProp(pageContext, 'urlPathname', 'string'), errMsg('`pageContext.urlPathname` should be a string'))
  assertUsage(hasProp(pageContext, '_pageId', 'string'), errMsg('`pageContext._pageId` should be a string'))
  assertUsage(hasProp(pageContext, '__getPageAssets'), errMsg('`pageContext.__getPageAssets` is missing'))
  assertUsage(hasProp(pageContext, '_passToClient', 'string[]'), errMsg('`pageContext._passToClient` is missing'))
  castProp<() => Promise<PageAsset[]>, typeof pageContext, '__getPageAssets'>(pageContext, '__getPageAssets')
  htmlString = await injectHtmlTagsToString([htmlString], pageContext as any, false, null)
  return htmlString
}
