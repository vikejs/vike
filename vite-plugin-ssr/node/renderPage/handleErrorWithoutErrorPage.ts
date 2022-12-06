export { handleErrorWithoutErrorPage }

import { stringify } from '@brillout/json-serializer/stringify'
import { getGlobalContext } from '../globalContext'
import { assert, assertWarning, objectAssign } from '../utils'
import { createHttpResponseObject } from './createHttpResponseObject'
import type { GetPageAssets } from './getPageAssets'
import type { RenderResult } from './renderPageContext'

async function handleErrorWithoutErrorPage(pageContext: {
  _isPageContextRequest: boolean
  errorWhileRendering: null | Error
  is404: null | boolean
  _pageId: null
  urlOriginal: string
}): Promise<RenderResult> {
  assert(pageContext._pageId === null) // User didn't define a `_error.page.js` file
  assert(pageContext.errorWhileRendering || pageContext.is404)

  warnMissingErrorPage()

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
      'No `_error.page.js` found. We recommend creating a `_error.page.js` file. (This warning is not shown in production.)',
      { showStackTrace: false, onlyOnce: true }
    )
  }
}
