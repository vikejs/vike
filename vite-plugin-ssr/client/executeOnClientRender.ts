export { executeOnClientRender }

import { assert, assertUsage, callHookWithTimeout, unique } from './utils'
import { getHook, type Hook } from '../shared/getHook'
import type { PageFile, PageContextExports } from '../shared/getPageFiles'
import { type PageContextRelease, releasePageContext } from './releasePageContext'
import type { PlusConfig } from '../shared/page-configs/PlusConfig'
import { getPlusConfig } from '../shared/page-configs/utils'

async function executeOnClientRender<
  PC extends {
    _pageFilesLoaded: PageFile[]
    urlOriginal?: string
    _pageId: string
    _plusConfigs: PlusConfig[]
  } & PageContextExports &
    PageContextRelease
>(pageContext: PC, isClientRouting: boolean): Promise<void> {
  const pageContextReadyForRelease = releasePageContext(pageContext, isClientRouting)

  let hook: null | Hook = null
  let hookName: 'render' | 'onClientRender'

  {
    const renderHook = getHook(pageContext, 'render')
    // assertWarning(!renderHook, 'Hook render() has been renamed to onRenderHtml() and onRenderClient()', { onlyOnce: true, showStackTrace: false }) // TODO/v1: replace this warning with waning that user should migrate to v1
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
    const url = getUrl(pageContext)
    if (pageContext._plusConfigs.length > 0) {
      assertMissingHook(pageContext._pageId, pageContext._plusConfigs, url)
    } else {
      const pageClientsFilesLoaded = pageContext._pageFilesLoaded.filter((p) => p.fileType === '.page.client')
      let errMsg: string
      if (pageClientsFilesLoaded.length === 0) {
        errMsg = 'No file `*.page.client.*` found for URL ' + url
      } else {
        errMsg =
          'One of the following files should export a `render()` hook: ' +
          pageClientsFilesLoaded.map((p) => p.filePath).join(' ')
      }
      assertUsage(false, errMsg)
    }
  }

  assert(hook)
  const renderHook = hook.hook
  assert(hookName)

  // We don't use a try-catch wrapper because rendering errors are usually handled by the UI framework. (E.g. React's Error Boundaries.)
  const hookResult = await callHookWithTimeout(() => renderHook(pageContextReadyForRelease), 'render', hook.hookSrc)
  assertUsage(
    hookResult === undefined,
    `The ${hookName}() hook defined by ${hook.hookSrc} isn't allowed to return a value`
  )
}

function getUrl(pageContext: { urlOriginal?: string }): string {
  let url: string | undefined
  // try/catch to avoid passToClient assertUsage(), although I'd expect this to not be needed since we're accessing pageContext and not pageContextReadyForRelease
  try {
    url = pageContext.urlOriginal
  } catch {}
  url = url ?? window.location.href
  return url
}

function assertMissingHook(pageId: string, plusConfigs: PlusConfig[], url: string) {
  const plusConfig = getPlusConfig(pageId, plusConfigs)
  assert(!plusConfig.configElements.onRenderClient?.configValue)
  assert(plusConfig.configElements.clientRouting?.configValue === true)

  // We miss abstract page config files (that define onClientRender()) that don't apply to any concrete page config
  //  - A solution is to assertUsage() when an abstract page file doens't apply to any concrete page config
  const plusConfigFilesDefiningHook: string[] = []
  let plusConfigFilesAll: string[] = []
  plusConfigs.forEach((plusConfig) => {
    plusConfigFilesAll.push(...plusConfig.plusConfigFilePathAll)
    const configElement = plusConfig.configElements.onRenderClient
    if (configElement && configElement.configValue) {
      plusConfigFilesDefiningHook.push(configElement.configDefinedAt)
    }
  })
  plusConfigFilesAll = unique(plusConfigFilesAll)

  const indent = '- '
  const msgIntro = `No onRenderClient() hook found for URL \`${url}\`. (A onRenderClient() hook is required when using Client Routing: the config \`clientRouting\` is \`true\` for the URL \`${url}\`.)`
  if (plusConfigFilesDefiningHook.length === 0) {
    assertUsage(
      false,
      [
        // TODO: update msg
        `${msgIntro} No onRenderClient() hook is defined by any of your page config files. Your page config files (which none of them defines \`onClientRender()\`):`,
        ...plusConfigFilesAll.map((p) => indent + p)
      ].join('\n')
    )
  } else {
    const plural = plusConfigFilesDefiningHook.length >= 2
    assertUsage(
      false,
      [
        `${msgIntro} Note that onRenderClient() is defined at:`,
        ...plusConfigFilesDefiningHook.map((p) => `${indent}${p}`),
        `but ${plural ? 'none of them' : "it doesn't"} apply to the URL \`${url}\`.`
      ].join('\n')
    )
  }
}
