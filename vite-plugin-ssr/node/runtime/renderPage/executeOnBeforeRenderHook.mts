export { executeOnBeforeRenderHooks }

import { type PageContextExports } from '../../../shared/getPageFiles.mjs'
import { getHook } from '../../../shared/hooks/getHook.mjs'
import {
  preparePageContextForUserConsumptionServerSide,
  type PageContextForUserConsumptionServerSide
} from './preparePageContextForUserConsumptionServerSide.mjs'
import { executeHook } from '../utils.mjs'
import { assertOnBeforeRenderHookReturn } from '../../../shared/assertOnBeforeRenderHookReturn.mjs'

async function executeOnBeforeRenderHooks(
  pageContext: {
    _pageId: string
    _pageContextAlreadyProvidedByOnPrerenderHook?: true
  } & PageContextExports &
    PageContextForUserConsumptionServerSide
): Promise<void> {
  if (pageContext._pageContextAlreadyProvidedByOnPrerenderHook) {
    return
  }
  const hook = getHook(pageContext, 'onBeforeRender')
  if (!hook) {
    return
  }
  const onBeforeRender = hook.hookFn
  preparePageContextForUserConsumptionServerSide(pageContext)
  const hookResult = await executeHook(() => onBeforeRender(pageContext), 'onBeforeRender', hook.hookFilePath)

  assertOnBeforeRenderHookReturn(hookResult, hook.hookFilePath)
  const pageContextFromHook = hookResult?.pageContext
  Object.assign(pageContext, pageContextFromHook)
}
