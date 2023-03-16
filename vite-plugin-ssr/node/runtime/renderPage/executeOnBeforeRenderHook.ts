export { executeOnBeforeRenderHooks }

import { type PageContextExports } from '../../../shared/getPageFiles'
import { getHook } from '../../../shared/getHook'
import { assertHookResult } from '../../../shared/assertHookResult'
import { preparePageContextForRelease, type PageContextPublic } from './preparePageContextForRelease'
import { callHookWithTimeout } from '../utils'

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
  const onBeforeRender = hook.hook
  preparePageContextForRelease(pageContext)
  const hookResult = await callHookWithTimeout(() => onBeforeRender(pageContext), 'onBeforeRender', hook.hookSrc)

  assertHookResult(hookResult, 'onBeforeRender', ['pageContext'], hook.hookSrc)
  const pageContextFromHook = hookResult?.pageContext
  Object.assign(pageContext, pageContextFromHook)
}
