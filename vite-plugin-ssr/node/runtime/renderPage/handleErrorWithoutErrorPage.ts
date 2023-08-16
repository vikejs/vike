export { handleErrorWithoutErrorPage }

import { stringify } from '@brillout/json-serializer/stringify'
import { getGlobalContext } from '../globalContext.js'
import { assert, assertWarning, objectAssign } from '../utils.js'
import { createHttpResponseObject } from './createHttpResponseObject.js'
import pc from '@brillout/picocolors'
import type { GetPageAssets } from './getPageAssets.js'
import type { PageContextAfterRender } from './renderPageAlreadyRouted.js'
import type { PageConfig } from '../../../shared/page-configs/PageConfig.js'

// When the user hasn't defined _error.page.js
async function handleErrorWithoutErrorPage<
  PageContext extends {
    isClientSideNavigation: boolean
    errorWhileRendering: null | Error
    is404: null | boolean
    _pageId: null
    _pageConfigs: PageConfig[]
    urlOriginal: string
  }
>(pageContext: PageContext): Promise<PageContext & PageContextAfterRender> {
  assert(pageContext._pageId === null)
  assert(pageContext.errorWhileRendering || pageContext.is404)

  {
    const isV1 = pageContext._pageConfigs.length > 0
    warnMissingErrorPage(isV1)
  }

  if (!pageContext.isClientSideNavigation) {
    objectAssign(pageContext, { httpResponse: null })
    return pageContext
  } else {
    const __getPageAssets: GetPageAssets = async () => []
    objectAssign(pageContext, { __getPageAssets })
    const httpResponse = await createHttpResponseObject(stringify({ serverSideError: true }), null, pageContext)
    objectAssign(pageContext, { httpResponse })
    return pageContext
  }
}

function warnMissingErrorPage(isV1: boolean): void {
  const globalContext = getGlobalContext()
  if (!globalContext.isProduction) {
    const msg = [
      `No ${isV1 ? 'error page' : pc.cyan('_error.page.js')} found,`,
      'we recommend defining an error page,',
      'see https://vite-plugin-ssr.com/error-page'
    ].join(' ')
    assertWarning(false, msg, { onlyOnce: true })
  }
}
