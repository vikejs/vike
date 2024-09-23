export { preparePageContextForUserConsumption }

import { assert, assertWarning } from './utils.js'
import type { PageContextForUserConsumptionClientSide } from '../client/shared/preparePageContextForUserConsumptionClientSide.js'
import type { PageContextForUserConsumptionServerSide } from '../node/runtime/renderPage/preparePageContextForUserConsumptionServerSide.js'

type PageContextForUserConsumption = PageContextForUserConsumptionServerSide | PageContextForUserConsumptionClientSide
function preparePageContextForUserConsumption(pageContext: PageContextForUserConsumption) {
  assert(pageContext.pageId)

  // TODO/next-major-release: remove
  if (!('_pageId' in pageContext)) {
    Object.defineProperty(pageContext, '_pageId', {
      get() {
        assertWarning(false, 'pageContext._pageId has been renamed to pageContext.pageId', {
          showStackTrace: true,
          onlyOnce: true
        })
        return pageContext.pageId
      },
      enumerable: false
    })
  }
}
