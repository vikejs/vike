export { handleErrorWithoutErrorPage }
export { warnMissingErrorPage }

import { stringify } from '@brillout/json-serializer/stringify'
import { getGlobalContext } from '../globalContext'
import { assert, assertWarning, objectAssign } from '../utils'
import { createHttpResponseObject } from './createHttpResponseObject'
import pc from 'picocolors'
import type { GetPageAssets } from './getPageAssets'
import type { PageContextAfterRender } from './renderPageContext'
import type { PageConfig } from '../../../shared/page-configs/PageConfig'

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
  assert(pageContext._pageId === null) // User didn't define a `_error.page.js` file
  assert(pageContext.errorWhileRendering || pageContext.is404)

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
    const msg = isV1
      ? // TODO/v1: improve error message
        "No error page found. It's recommended to create one."
      : `No ${pc.cyan('_error.page.js')} found. We recommend creating a ${pc.cyan(
          '_error.page.js'
        )} file. See https://vite-plugin-ssr.com/error-page for more information. (This warning isn't shown in production.)`
    assertWarning(false, msg, { showStackTrace: false, onlyOnce: false })
  }
}
