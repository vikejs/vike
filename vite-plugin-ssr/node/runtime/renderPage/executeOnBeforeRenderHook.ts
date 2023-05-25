export { executeOnBeforeRenderHooks }

import { type PageContextExports } from '../../../shared/getPageFiles'
import { getHook } from '../../../shared/getHook'
import { preparePageContextForRelease, type PageContextPublic } from './preparePageContextForRelease'
import { callHookWithTimeout } from '../utils'
import { assertOnBeforeRenderHookReturn } from '../../../shared/assertOnBeforeRenderHookReturn'

async function executeOnBeforeRenderHooks(
  pageContext: {
    _pageId: string
    _pageContextAlreadyProvidedByOnPrerenderHook?: true
  } & PageContextExports &
    PageContextPublic
): Promise<void> {
  if (pageContext._pageContextAlreadyProvidedByOnPrerenderHook) {
    return
  }
  const hook = getHook(pageContext, 'onBeforeRender')
  if (!hook) {
    return
  }
  const onBeforeRender = hook.hookFn
  preparePageContextForRelease(pageContext)
  const hookResult = await callHookWithTimeout(() => onBeforeRender(pageContext), 'onBeforeRender', hook.hookFilePath)

  assertOnBeforeRenderHookReturn(hookResult, hook.hookFilePath)
  const pageContextFromHook = hookResult?.pageContext
  Object.assign(pageContext, pageContextFromHook)
}
