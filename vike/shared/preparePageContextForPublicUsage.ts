export { preparePageContextForPublicUsage }
export type { PageContextForPublicUsage }

import { assert, assertWarning, compareString } from './utils.js'
import type { PageContextForPublicUsageClientShared } from '../client/shared/preparePageContextForPublicUsageClientShared.js'
import type { PageContextForPublicUsageServer } from '../node/runtime/renderPage/preparePageContextForPublicUsageServer.js'
import { addIs404ToPageProps } from './addIs404ToPageProps.js'

type PageContextForPublicUsage = PageContextForPublicUsageServer | PageContextForPublicUsageClientShared

function preparePageContextForPublicUsage(pageContext: PageContextForPublicUsage) {
  assert((pageContext as any)._isOriginalObject) // ensure we preserve the original object reference

  addIs404ToPageProps(pageContext)

  // TODO/next-major-release: remove
  if (!('_pageId' in pageContext)) {
    Object.defineProperty(pageContext, '_pageId', {
      get() {
        assertWarning(false, 'pageContext._pageId has been renamed to pageContext.pageId', {
          showStackTrace: true,
          onlyOnce: true
        })
        return (pageContext as any).pageId
      },
      enumerable: false
    })
  }

  // For a more readable `console.log(pageContext)` output
  sortPageContext(pageContext)
}

// Sort `pageContext` keys alphabetically, in order to make reading the `console.log(pageContext)` output easier
function sortPageContext(pageContext: Record<string, unknown>): void {
  let descriptors = Object.getOwnPropertyDescriptors(pageContext)
  for (const key of Object.keys(pageContext)) delete pageContext[key]
  descriptors = Object.fromEntries(Object.entries(descriptors).sort(([key1], [key2]) => compareString(key1, key2)))
  Object.defineProperties(pageContext, descriptors)
}
