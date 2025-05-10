export { preparePageContextForPublicUsage }

import { assert, assertWarning, compareString } from './utils.js'
import { addIs404ToPageProps } from './addIs404ToPageProps.js'

// TODO/now define proxy here because of direct preparePageContextForPublicUsage() calls
function preparePageContextForPublicUsage(pageContext: Record<string, unknown>) {
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

  return pageContext
}

// Sort `pageContext` keys alphabetically, in order to make reading the `console.log(pageContext)` output easier
function sortPageContext(pageContext: Record<string, unknown>): void {
  let descriptors = Object.getOwnPropertyDescriptors(pageContext)
  for (const key of Object.keys(pageContext)) delete pageContext[key]
  descriptors = Object.fromEntries(Object.entries(descriptors).sort(([key1], [key2]) => compareString(key1, key2)))
  Object.defineProperties(pageContext, descriptors)
}
