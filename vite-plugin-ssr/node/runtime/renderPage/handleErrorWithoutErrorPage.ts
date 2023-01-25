export { handleErrorWithoutErrorPage }
export { warnMissingErrorPage }

import { stringify } from '@brillout/json-serializer/stringify'
import { getGlobalContext } from '../globalContext'
import { assert, assertWarning, objectAssign } from '../../utils'
import { createHttpResponseObject } from './createHttpResponseObject'
import pc from 'picocolors'
import type { GetPageAssets } from './getPageAssets'
import type { PageContextAfterRender } from './renderPageContext'

async function handleErrorWithoutErrorPage<
  PageContext extends {
    _isPageContextRequest: boolean
    errorWhileRendering: null | Error
    is404: null | boolean
    _pageId: null
    urlOriginal: string
  }
>(pageContext: PageContext): Promise<PageContext & PageContextAfterRender> {
  assert(pageContext._pageId === null) // User didn't define a `_error.page.js` file
  assert(pageContext.errorWhileRendering || pageContext.is404)

  if (!pageContext._isPageContextRequest) {
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

function warnMissingErrorPage(): void {
  const globalContext = getGlobalContext()
  if (!globalContext.isProduction) {
    assertWarning(
      false,
      `No ${pc.cyan('_error.page.js')} found. We recommend creating a ${pc.cyan(
        '_error.page.js'
      )} file. See https://vite-plugin-ssr.com/error-page for more information. (This warning isn't shown in production.)`,
      { showStackTrace: false, onlyOnce: true }
    )
  }
}
