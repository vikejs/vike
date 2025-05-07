export { executeOnBeforeRenderAndDataHooks }

import { getHookFromPageContext } from '../../../shared/hooks/getHook.js'
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
    // Note: hookResult can be anything (e.g. an object) and is to be assigned to pageContext.data
    const pageContextFromHook = {
      data: dataHook.hookResult
    }
    Object.assign(pageContext, pageContextFromHook)
  }

  const res = await executeHookServer('onBeforeRender', pageContext)
  const onBeforeRenderHook = res[0] // TO-DO/soon: support cumulative
  if (onBeforeRenderHook) {
    const { hookResult } = onBeforeRenderHook
    assertOnBeforeRenderHookReturn(hookResult, onBeforeRenderHook.hookFilePath)
    const pageContextFromHook = hookResult?.pageContext
    Object.assign(pageContext, pageContextFromHook)
  }
}
