export { executeOnBeforeRenderHooks }

import { type PageContextExports } from '../../../shared/getPageFiles.js'
import { getHook } from '../../../shared/hooks/getHook.js'
import {
  preparePageContextForUserConsumptionServerSide,
  type PageContextForUserConsumptionServerSide
} from './preparePageContextForUserConsumptionServerSide.js'
import { executeHook } from '../utils.js'
import { assertOnBeforeRenderHookReturn } from '../../../shared/assertOnBeforeRenderHookReturn.js'
import { getTimeouts } from '../../../shared/hooks/getTimeouts.js'

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
  const { timeoutErr, timeoutWarn } = getTimeouts(pageContext.config.timeouts, hook.hookName)
  const hookResult = await executeHook(
    () => onBeforeRender(pageContext),
    'onBeforeRender',
    hook.hookFilePath,
    timeoutErr,
    timeoutWarn
  )

  assertOnBeforeRenderHookReturn(hookResult, hook.hookFilePath)
  const pageContextFromHook = hookResult?.pageContext
  Object.assign(pageContext, pageContextFromHook)
}
