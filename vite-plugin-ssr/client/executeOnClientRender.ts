export { executeOnClientRender }

import { assert, assertUsage, callHookWithTimeout } from './utils'
import { getHook, type Hook } from '../shared/getHook'
import type { PageFile, PageContextExports } from '../shared/getPageFiles'
import { type PageContextRelease, releasePageContext } from './releasePageContext'
import type { PageConfig2 } from '../shared/page-configs/PageConfig'

async function executeOnClientRender<
  PC extends {
    _pageFilesLoaded: PageFile[]
    urlOriginal?: string
    _pageId: string
    _pageConfigs: PageConfig2[]
  } & PageContextExports &
    PageContextRelease
>(pageContext: PC, isClientRouter: boolean): Promise<void> {
  const pageContextReadyForRelease = releasePageContext(pageContext, isClientRouter)

  let hook: null | Hook = null
  let hookName: 'render' | 'onClientRender'

  {
    const renderHook = getHook(pageContext, 'render')
    // assertWarning(!renderHook, 'Hook render() has been renamed to onRenderHtml() and onRenderClient()', { onlyOnce: true, showStackTrace: false }) // TODO
    hook = renderHook
    hookName = 'render'
  }
  {
    const renderHook = getHook(pageContext, 'onRenderClient')
    if (renderHook) {
      hook = renderHook
      hookName = 'onClientRender'
    }
  }

  if (!hook) {
    const pageClientsFilesLoaded = pageContext._pageFilesLoaded.filter((p) => p.fileType === '.page.client')
    let errMsg: string
    if (pageContext._pageConfigs.length > 0) {
      /*
      if ( !pageContext._pageConfigFiles.some(p => 'onClientRender' in p.pageConfigValues) ) {
        assertUsage(false, 'No onRenderClient() hook found. None of your config files define onRenderClient(): '+ pageContext._pageFilesLoaded.map(p => p.pageConfigFilePath).join(' ')) // TODO: define and use pageContext._pageConfigFiles
      } else {
        assertUsage(false, 'No onRenderClient() hook found for URL ...); // TODO: show URL + show relevant page config files 
      }
      */
      assertUsage(false, 'No onRenderClient() hook found') // TODO: define and use pageContext._pageConfigFiles
    } else {
      if (pageClientsFilesLoaded.length === 0) {
        let url: string | undefined
        // try/catch to avoid passToClient assertUsage(), although I'd expect this to not be needed since we're accessing pageContext and not pageContextReadyForRelease
        try {
          url = pageContext.urlOriginal
        } catch {}
        url = url ?? window.location.href
        errMsg = 'No file `*.page.client.*` found for URL ' + url // TODO
      } else {
        errMsg =
          'One of the following files should export a `render()` hook: ' + // TODO
          pageClientsFilesLoaded.map((p) => p.filePath).join(' ')
      }
      assertUsage(false, errMsg)
    }
  }

  assert(hook)
  const renderHook = hook.hook
  assert(hookName)

  // We don't use a try-catch wrapper because rendering errors are usually handled by the UI framework. (E.g. React's Error Boundaries.)
  const hookResult = await callHookWithTimeout(() => renderHook(pageContextReadyForRelease), 'render', hook.filePath)
  assertUsage(
    hookResult === undefined,
    `The ${hookName}() hook defined by ${hook.filePath} isn't allowed to return a value`
  )
}
