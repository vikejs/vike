export { executeOnBeforeRenderHooks }

import { type PageContextExports } from '../../../shared/getPageFiles'
import { getHook } from '../../../shared/hooks/getHook'
import {
  preparePageContextForUserConsumptionServerSide,
  type PageContextForUserConsumptionServerSide
} from './preparePageContextForUserConsumptionServerSide'
import { executeHook } from '../utils'
import { assertOnBeforeRenderHookReturn } from '../../../shared/assertOnBeforeRenderHookReturn'

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
