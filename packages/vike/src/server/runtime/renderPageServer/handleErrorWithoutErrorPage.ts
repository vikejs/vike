export { handleErrorWithoutErrorPage }

import type { GlobalContextServerInternal } from '../globalContext.js'
import { assert, assertWarning } from '../../../utils/assert.js'
import { objectAssign } from '../../../utils/objectAssign.js'
import { createHttpResponseErrorFallback, createHttpResponseErrorFallbackJson } from './createHttpResponse.js'
import pc from '@brillout/picocolors'
import type { GetPageAssets } from './getPageAssets.js'
import type { PageContextCreatedServer } from './createPageContextServer.js'

// When the user hasn't defined _error.page.js
function handleErrorWithoutErrorPage<
  PageContext extends PageContextCreatedServer & {
    errorWhileRendering: null | Error
    is404: null | boolean
    pageId: null
    _globalContext: GlobalContextServerInternal
    urlOriginal: string
  },
>(pageContext: PageContext) {
  assert(pageContext.pageId === null)
  assert(pageContext.errorWhileRendering || pageContext.is404)

  {
    const isV1 = pageContext._globalContext._pageConfigs.length > 0
    warnMissingErrorPage(isV1, pageContext._globalContext._isProduction)
  }

  if (!pageContext.isClientSideNavigation) {
    const httpResponse = createHttpResponseErrorFallback(pageContext)
    objectAssign(pageContext, { httpResponse })
    return pageContext
  } else {
    const __getPageAssets: GetPageAssets = async () => []
    objectAssign(pageContext, { __getPageAssets })
    const httpResponse = createHttpResponseErrorFallbackJson()
    objectAssign(pageContext, { httpResponse })
    return pageContext
  }
}

function warnMissingErrorPage(isV1: boolean, isProduction: boolean) {
  if (!isProduction) {
    const msg = [
      `No ${isV1 ? 'error page' : pc.cyan('_error.page.js')} found,`,
      'we recommend defining one',
      'https://vike.dev/error-page',
    ].join(' ')
    assertWarning(false, msg, { onlyOnce: true })
  }
}
