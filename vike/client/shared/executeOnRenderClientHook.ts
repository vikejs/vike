export { executeOnRenderClientHook }
export type { PageContextBeforeRenderClient }

import { assert, assertUsage } from '../server-routing-runtime/utils.js'
import { getHookFromPageContext, type Hook } from '../../shared/hooks/getHook.js'
import type { PageFile, PageConfigUserFriendlyOld } from '../../shared/getPageFiles.js'
import type { PageContextForPublicUsageClientShared } from './preparePageContextForPublicUsageClientShared.js'
import type { PageConfigRuntime } from '../../shared/page-configs/PageConfig.js'
import { executeHook } from '../../shared/hooks/executeHook.js'

type PageContextBeforeRenderClient = {
  _pageFilesLoaded: PageFile[]
  urlOriginal?: string
  urlPathname?: string
  pageId: string
  _pageConfigs: PageConfigRuntime[]
} & PageConfigUserFriendlyOld &
  PageContextForPublicUsageClientShared

async function executeOnRenderClientHook<PageContext extends PageContextBeforeRenderClient>(
  pageContext: PageContext,
  prepareForPublicUsage: (pageConfig: PageContext) => PageContext
): Promise<void> {
  let hook: null | Hook = null
  let hookName: 'render' | 'onRenderClient'

  {
    const renderHook = getHookFromPageContext(pageContext, 'render')
    hook = renderHook
    hookName = 'render'
  }
  {
    const renderHook = getHookFromPageContext(pageContext, 'onRenderClient')
    if (renderHook) {
      hook = renderHook
      hookName = 'onRenderClient'
    }
  }

  if (!hook) {
    const urlToShowToUser = getUrlToShowToUser(pageContext)
    assert(urlToShowToUser)
    if (pageContext._pageConfigs.length > 0) {
      // V1 design
      assertUsage(
        false,
        `No onRenderClient() hook defined for URL '${urlToShowToUser}', but it's needed, see https://vike.dev/onRenderClient`
      )
    } else {
      // TODO/v1-release: remove
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

  assert(hook)
  const renderHook = hook.hookFn
  assert(hookName)

  const pageContextForPublicUsage = prepareForPublicUsage(pageContext)
  // We don't use a try-catch wrapper because rendering errors are usually handled by the UI framework. (E.g. React's Error Boundaries.)
  const hookResult = await executeHook(() => renderHook(pageContextForPublicUsage), hook, pageContext)
  assertUsage(
    hookResult === undefined,
    `The ${hookName}() hook defined by ${hook.hookFilePath} isn't allowed to return a value`
  )
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
