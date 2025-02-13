export { executeOnBeforeRenderAndDataHooks }

import { type PageConfigUserFriendlyOld } from '../../../shared/getPageFiles.js'
import { getHook } from '../../../shared/hooks/getHook.js'
import {
  preparePageContextForUserConsumptionServerSide,
  type PageContextForUserConsumptionServerSide
} from './preparePageContextForUserConsumptionServerSide.js'
import { assertOnBeforeRenderHookReturn } from '../../../shared/assertOnBeforeRenderHookReturn.js'
import { executeHook } from '../../../shared/hooks/executeHook.js'

async function executeOnBeforeRenderAndDataHooks(
  pageContext: {
    pageId: string
    _pageContextAlreadyProvidedByOnPrerenderHook?: true
  } & PageConfigUserFriendlyOld &
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
    const hookResult = await executeHook(() => dataHook.hookFn(pageContext), dataHook, pageContext)
    // Note: hookResult can be anything (e.g. an object) and is to be assigned to pageContext.data
    const pageContextFromHook = {
      data: hookResult
    }
    Object.assign(pageContext, pageContextFromHook)
  }

  if (onBeforeRenderHook) {
    const hookResult = await executeHook(() => onBeforeRenderHook.hookFn(pageContext), onBeforeRenderHook, pageContext)
    assertOnBeforeRenderHookReturn(hookResult, onBeforeRenderHook.hookFilePath)
    const pageContextFromHook = hookResult?.pageContext
    Object.assign(pageContext, pageContextFromHook)
  }
}
