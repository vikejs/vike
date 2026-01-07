import '../assertEnvClient.js'

export { execHookOnRenderClient }
export type { PageContextBeforeRenderClient }

import { assert, assertUsage } from '../../utils/assert.js'
import { getHookFromPageContext, type Hook } from '../../shared-server-client/hooks/getHook.js'
import type { PageFile, PageContextConfig } from '../../shared-server-client/getPageFiles.js'
import { execHookSingle } from '../../shared-server-client/hooks/execHook.js'
import type { GlobalContextClientInternalShared } from './getGlobalContextClientInternalShared.js'
import type { PageContextCreatedClient } from '../runtime-client-routing/createPageContextClient.js'
import type { PageContextCreatedClient_ServerRouting } from '../runtime-server-routing/createPageContextClient.js'

type PageContextCreatedClientShared = PageContextCreatedClient | PageContextCreatedClient_ServerRouting

type PageContextBeforeRenderClient = {
  _pageFilesLoaded: PageFile[]
  urlOriginal?: string
  urlPathname?: string
  pageId: string
  _globalContext: GlobalContextClientInternalShared
} & PageContextCreatedClientShared &
  PageContextConfig

async function execHookOnRenderClient<PageContext extends PageContextBeforeRenderClient>(
  pageContext: PageContext,
  getPageContextPublic: (pageContext: PageContext) => PageContext,
): Promise<void> {
  let hook: null | Hook = null

  {
    const renderHook = getHookFromPageContext(pageContext, 'render')
    hook = renderHook
  }
  {
    const renderHook = getHookFromPageContext(pageContext, 'onRenderClient')
    if (renderHook) {
      hook = renderHook
    }
  }

  if (!hook) {
    const urlToShowToUser = getUrlToShowToUser(pageContext)
    assert(urlToShowToUser)
    if (pageContext._globalContext._pageConfigs.length > 0) {
      // V1 design
      assertUsage(
        false,
        `No onRenderClient() hook defined for URL '${urlToShowToUser}', but it's needed, see https://vike.dev/onRenderClient`,
      )
    } else {
      // TO-DO/next-major-release: remove
      // V0.4 design
      const pageClientsFilesLoaded = pageContext._pageFilesLoaded.filter((p) => p.fileType === '.page.client')
      let errMsg: string
      if (pageClientsFilesLoaded.length === 0) {
        errMsg = 'No file `*.page.client.*` found for URL ' + urlToShowToUser
      } else {
        errMsg =
          'One of the following files should export a render() hook: ' +
          pageClientsFilesLoaded.map((p) => p.filePath).join(' ')
      }
      assertUsage(false, errMsg)
    }
  }

  // We don't use a try-catch wrapper because rendering errors are usually handled by the UI framework. (E.g. React's Error Boundaries.)
  await execHookSingle(hook, pageContext, getPageContextPublic)
}

function getUrlToShowToUser(pageContext: { urlOriginal?: string; urlPathname?: string }): string {
  let url: string | undefined
  // try/catch to avoid passToClient assertUsage() (although: this may not be needed anymore, since we're now accessing pageContext and not pageContextPublic)
  try {
    url =
      // Client Routing
      pageContext.urlPathname ??
      // Server Routing
      pageContext.urlOriginal
  } catch {}
  url = url ?? window.location.href
  return url
}
