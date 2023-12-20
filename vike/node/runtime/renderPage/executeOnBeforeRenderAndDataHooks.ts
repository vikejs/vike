export { executeOnBeforeRenderAndDataHooks }

import { type PageContextExports } from '../../../shared/getPageFiles.js'
import { getHook } from '../../../shared/hooks/getHook.js'
import {
  preparePageContextForUserConsumptionServerSide,
  type PageContextForUserConsumptionServerSide
} from './preparePageContextForUserConsumptionServerSide.js'
import { executeHook } from '../utils.js'
import { assertOnBeforeRenderHookReturn } from '../../../shared/assertOnBeforeRenderHookReturn.js'

async function executeOnBeforeRenderAndDataHooks(
  pageContext: {
    _pageId: string
    _pageContextAlreadyProvidedByOnPrerenderHook?: true
  } & PageContextExports &
    PageContextForUserConsumptionServerSide
): Promise<void> {
  if (pageContext._pageContextAlreadyProvidedByOnPrerenderHook) {
    return
  }
  const dataHook = getHook(pageContext, 'data')
  const onBeforeRenderHook = getHook(pageContext, 'onBeforeRender')
  if (!dataHook && !onBeforeRenderHook) {
    return
  }

  preparePageContextForUserConsumptionServerSide(pageContext)

  if (dataHook) {
    const hookResult = await executeHook(() => dataHook.hookFn(pageContext), dataHook)
    // Note: hookResult can be anything (e.g. an object) and is to be assigned to pageContext.data
    const pageContextFromHook = {
      data: hookResult
    }
    Object.assign(pageContext, pageContextFromHook)
  }

  if (onBeforeRenderHook) {
    const hookResult = await executeHook(() => onBeforeRenderHook.hookFn(pageContext), onBeforeRenderHook)
    assertOnBeforeRenderHookReturn(hookResult, onBeforeRenderHook.hookFilePath)
    const pageContextFromHook = hookResult?.pageContext
    Object.assign(pageContext, pageContextFromHook)
  }
}
