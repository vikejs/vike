export { handleErrorWithoutErrorPage }

import { stringify } from '@brillout/json-serializer/stringify'
import { getGlobalContext } from '../globalContext'
import { assert, assertWarning, objectAssign } from '../utils'
import { createHttpResponsePage, createHttpResponseError } from './createHttpResponse'
import pc from '@brillout/picocolors'
import type { GetPageAssets } from './getPageAssets'
import type { PageContextAfterRender } from './renderPageAlreadyRouted'
import type { PageConfigRuntime } from '../../../shared/page-configs/PageConfig'
import type { PageFile } from '../../../shared/getPageFiles'

// When the user hasn't defined _error.page.js
async function handleErrorWithoutErrorPage<
  PageContext extends {
    isClientSideNavigation: boolean
    errorWhileRendering: null | Error
    is404: null | boolean
    pageId: null
    _pageFilesAll: PageFile[]
    _pageConfigs: PageConfigRuntime[]
    urlOriginal: string
  }
>(pageContext: PageContext): Promise<PageContext & PageContextAfterRender> {
  assert(pageContext.pageId === null)
  assert(pageContext.errorWhileRendering || pageContext.is404)

  {
    const isV1 = pageContext._pageConfigs.length > 0
    warnMissingErrorPage(isV1)
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

function warnMissingErrorPage(isV1: boolean): void {
  const globalContext = getGlobalContext()
  if (!globalContext.isProduction) {
    const msg = [
      `No ${isV1 ? 'error page' : pc.cyan('_error.page.js')} found,`,
      'we recommend defining one',
      'https://vike.dev/error-page'
    ].join(' ')
    assertWarning(false, msg, { onlyOnce: true })
  }
}
