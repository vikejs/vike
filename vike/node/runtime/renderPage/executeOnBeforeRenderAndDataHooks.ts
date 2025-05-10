export { executeOnBeforeRenderAndDataHooks }

import { assertOnBeforeRenderHookReturn } from '../../../shared/assertOnBeforeRenderHookReturn.js'
import { executeHookServer, type PageContextExecuteHookServer } from './executeHookServer.js'

async function executeOnBeforeRenderAndDataHooks(
  pageContext: {
    pageId: string
    _pageContextAlreadyProvidedByOnPrerenderHook?: true
  } & PageContextExecuteHookServer
): Promise<void> {
  if (pageContext._pageContextAlreadyProvidedByOnPrerenderHook) {
    return
  }

  const hooks = await executeHookServer('data', pageContext)
  const dataHook = hooks[0] // TO-DO/soon: support cumulative
  if (dataHook) {
    // Note: hookReturn can be anything (e.g. an object) and is to be assigned to pageContext.data
    const pageContextFromHook = {
      data: dataHook.hookReturn
    }
    Object.assign(pageContext, pageContextFromHook)

    // Execute +onData
    if (!pageContext.isClientSideNavigation) {
      await executeHookServer('onData', pageContext)
    }
  }

  const res = await executeHookServer('onBeforeRender', pageContext)
  const onBeforeRenderHook = res[0] // TO-DO/soon: support cumulative
  if (onBeforeRenderHook) {
    const { hookReturn } = onBeforeRenderHook
    assertOnBeforeRenderHookReturn(hookReturn, onBeforeRenderHook.hookFilePath)
    const pageContextFromHook = hookReturn?.pageContext
    Object.assign(pageContext, pageContextFromHook)
  }
}
