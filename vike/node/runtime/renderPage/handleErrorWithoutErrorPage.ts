export { handleErrorWithoutErrorPage }

import { stringify } from '@brillout/json-serializer/stringify'
import type { GlobalContextInternal } from '../globalContext.js'
import { assert, assertWarning, objectAssign } from '../utils.js'
import { createHttpResponsePage, createHttpResponseError } from './createHttpResponse.js'
import pc from '@brillout/picocolors'
import type { GetPageAssets } from './getPageAssets.js'
import type { PageContextAfterRender } from './renderPageAlreadyRouted.js'
import type { PageConfigRuntime } from '../../../shared/page-configs/PageConfig.js'
import type { PageFile } from '../../../shared/getPageFiles.js'

// When the user hasn't defined _error.page.js
async function handleErrorWithoutErrorPage<
  PageContext extends {
    isClientSideNavigation: boolean
    errorWhileRendering: null | Error
    is404: null | boolean
    pageId: null
    _pageFilesAll: PageFile[]
    _pageConfigs: PageConfigRuntime[]
    _globalContext: GlobalContextInternal
    urlOriginal: string
  }
>(pageContext: PageContext): Promise<PageContext & PageContextAfterRender> {
  assert(pageContext.pageId === null)
  assert(pageContext.errorWhileRendering || pageContext.is404)

  {
    const isV1 = pageContext._pageConfigs.length > 0
    await warnMissingErrorPage(isV1, pageContext._globalContext.isProduction)
  }

  if (!pageContext.isClientSideNavigation) {
    const httpResponse = createHttpResponseError(pageContext)
    objectAssign(pageContext, { httpResponse })
    return pageContext
  } else {
    const __getPageAssets: GetPageAssets = async () => []
    objectAssign(pageContext, { __getPageAssets })
    const httpResponse = await createHttpResponsePage(stringify({ serverSideError: true }), null, pageContext)
    objectAssign(pageContext, { httpResponse })
    return pageContext
  }
}

async function warnMissingErrorPage(isV1: boolean, isProduction: boolean) {
  if (!isProduction) {
    const msg = [
      `No ${isV1 ? 'error page' : pc.cyan('_error.page.js')} found,`,
      'we recommend defining one',
      'https://vike.dev/error-page'
    ].join(' ')
    assertWarning(false, msg, { onlyOnce: true })
  }
}
