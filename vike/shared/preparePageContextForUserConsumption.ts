export { preparePageContextForUserConsumption }

import { assert, assertWarning, compareString } from './utils.js'
import type { PageContextForUserConsumptionClientSide } from '../client/shared/preparePageContextForUserConsumptionClientShared.js'
import type { PageContextForUserConsumptionServerSide } from '../node/runtime/renderPage/preparePageContextForUserConsumptionServerSide.js'
import { addIs404ToPageProps } from './addIs404ToPageProps.js'

type PageContextForUserConsumption = PageContextForUserConsumptionServerSide | PageContextForUserConsumptionClientSide

function preparePageContextForUserConsumption(pageContext: PageContextForUserConsumption) {
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
