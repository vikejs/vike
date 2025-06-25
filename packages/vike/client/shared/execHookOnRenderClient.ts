export { execHookOnRenderClient }
export type { PageContextBeforeRenderClient }

import { assert, assertUsage } from '../runtime-server-routing/utils.js'
import { getHookFromPageContext, type Hook } from '../../shared/hooks/getHook.js'
import type { PageFile, VikeConfigPublicPageLazy } from '../../shared/getPageFiles.js'
import type { PageContextForPublicUsageClientShared } from './preparePageContextForPublicUsageClientShared.js'
import { execHookDirectSingle } from '../../shared/hooks/execHook.js'
import type { GlobalContextClientInternalShared } from './createGetGlobalContextClient.js'

type PageContextBeforeRenderClient = {
  _pageFilesLoaded: PageFile[]
  urlOriginal?: string
  urlPathname?: string
  pageId: string
  _globalContext: GlobalContextClientInternalShared
} & VikeConfigPublicPageLazy &
  PageContextForPublicUsageClientShared

async function execHookOnRenderClient<PageContext extends PageContextBeforeRenderClient>(
  pageContext: PageContext,
  prepareForPublicUsage: (pageConfig: PageContext) => PageContext,
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
  await execHookDirectSingle(hook, pageContext, prepareForPublicUsage)
}

function getUrlToShowToUser(pageContext: { urlOriginal?: string; urlPathname?: string }): string {
  let url: string | undefined
  // try/catch to avoid passToClient assertUsage() (although: this may not be needed anymore, since we're now accessing pageContext and not pageContextForPublicUsage)
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
