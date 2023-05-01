export { executeOnRenderHtmlHook }

import { type HtmlRender, isDocumentHtml, renderDocumentHtml } from '../html/renderHtml'
import { getHook, type Hook } from '../../../shared/getHook'
import {
  assert,
  assertUsage,
  assertWarning,
  hasProp,
  isObject,
  objectAssign,
  isPromise,
  callHookWithTimeout,
  isCallable
} from '../utils'
import type { PageAsset } from './getPageAssets'
import { assertHookResult } from '../../../shared/assertHookResult'
import { isStream } from '../html/stream'
import { assertPageContextProvidedByUser } from '../../../shared/assertPageContextProvidedByUser'
import type { PreloadFilter } from '../html/injectAssets/getHtmlTags'
import { logErrorWithVite } from './logError'
import { preparePageContextForRelease, type PageContextPublic } from './preparePageContextForRelease'
import type { PageContextPromise } from '../html/injectAssets'
import type { PlusConfig } from '../../../shared/page-configs/PlusConfig'

type GetPageAssets = () => Promise<PageAsset[]>

async function executeOnRenderHtmlHook(
  pageContext: PageContextPublic & {
    _pageId: string
    _plusConfigs: PlusConfig[]
    __getPageAssets: GetPageAssets
    _passToClient: string[]
    _isHtmlOnly: boolean
    _baseServer: string
    _pageFilePathsLoaded: string[]
  }
): Promise<{
  renderSrc: string
  htmlRender: null | HtmlRender
}> {
  let hook: null | Hook = null
  let hookName: 'render' | 'onRenderHtml' | undefined
  {
    const renderHook = getHook(pageContext, 'render')
    if (renderHook) {
      hook = renderHook
      hookName = 'render'
    }
  }
  {
    const renderHook = getHook(pageContext, 'onRenderHtml')
    if (renderHook) {
      hook = renderHook
      hookName = 'onRenderHtml'
    }
  }
  if (!hookName) {
    hookName = pageContext._plusConfigs.length > 0 ? 'onRenderHtml' : 'render'
  }

  assertUsage(
    hook,
    [
      `No ${hookName}() hook found`
      /*
      'See https://vite-plugin-ssr.com/render-modes for more information.',
      [
        // 'Loaded config files (none of them define the onRenderHtml() hook):',
        'Loaded server-side page files (none of them `export { render }`):',
        ...pageContext._pageFilePathsLoaded.map((f, i) => ` (${i + 1}): ${f}`)
      ].join('\n')
      */
    ].join(' ')
  )
  const render = hook.hook
  const renderSrc = hook.hookSrc

  preparePageContextForRelease(pageContext)
  const result = await callHookWithTimeout(() => render(pageContext), 'render', renderSrc)
  if (isObject(result) && !isDocumentHtml(result)) {
    assertHookResult(result, 'render', ['documentHtml', 'pageContext', 'injectFilter'] as const, renderSrc, true)
  }
  objectAssign(pageContext, { _renderHook: { hookSrc: renderSrc, hookName: 'render' as const } })

  const errPrefix = 'The render() hook defined by ' + renderSrc

  let pageContextPromise: PageContextPromise = null
  if (hasProp(result, 'pageContext')) {
    const pageContextProvidedByRenderHook = result.pageContext
    if (isPromise(pageContextProvidedByRenderHook) || isCallable(pageContextProvidedByRenderHook)) {
      assertWarning(
        !isPromise(pageContextProvidedByRenderHook),
        `${errPrefix} returns a pageContext promise which is deprecated in favor of returning a pageContext async function, see https://vite-plugin-ssr.com/stream#initial-data-after-stream-end`,
        { onlyOnce: true, showStackTrace: false }
      )
      pageContextPromise = pageContextProvidedByRenderHook
    } else {
      assertPageContextProvidedByUser(pageContextProvidedByRenderHook, { hook: pageContext._renderHook })
      Object.assign(pageContext, pageContextProvidedByRenderHook)
    }
  }
  objectAssign(pageContext, { _pageContextPromise: pageContextPromise })

  const errSuffix = [
    'a string generated with the `escapeInject` template tag or a string returned by `dangerouslySkipEscape()`,',
    'see https://vite-plugin-ssr.com/escapeInject'
  ].join(' ')

  let documentHtml: unknown
  if (!isObject(result) || isDocumentHtml(result)) {
    assertUsage(
      typeof result !== 'string',
      [
        errPrefix,
        'returned a plain JavaScript string which is forbidden;',
        'instead, it should return',
        errSuffix
      ].join(' ')
    )
    assertUsage(
      result === null || isDocumentHtml(result),
      [
        errPrefix,
        'should return `null`, a string `documentHtml`, or an object `{ documentHtml, pageContext }`',
        'where `pageContext` is `undefined` or an object holding additional `pageContext` values',
        'and `documentHtml` is',
        errSuffix
      ].join(' ')
    )
    documentHtml = result
  } else {
    if ('documentHtml' in result) {
      documentHtml = result.documentHtml
      assertUsage(
        typeof documentHtml !== 'string',
        [
          errPrefix,
          'returned `{ documentHtml }`, but `documentHtml` is a plain JavaScript string which is forbidden;',
          '`documentHtml` should be',
          errSuffix
        ].join(' ')
      )
      assertUsage(
        documentHtml === undefined || documentHtml === null || isDocumentHtml(documentHtml),
        [errPrefix, 'returned `{ documentHtml }`, but `documentHtml` should be', errSuffix].join(' ')
      )
    }
  }

  assert(documentHtml === undefined || documentHtml === null || isDocumentHtml(documentHtml))

  if (documentHtml === null || documentHtml === undefined) {
    return { htmlRender: null, renderSrc }
  }

  const onErrorWhileStreaming = (err: unknown) => {
    logErrorWithVite(err)
    /*
    objectAssign(pageContext, {
      errorWhileRendering: err,
      _serverSideErrorWhileStreaming: true
    })
    */
  }

  let injectFilter: PreloadFilter = null
  if (hasProp(result, 'injectFilter')) {
    assertUsage(isCallable(result.injectFilter), 'injectFilter should be a function')
    injectFilter = result.injectFilter
  }

  const htmlRender = await renderDocumentHtml(documentHtml, pageContext, renderSrc, onErrorWhileStreaming, injectFilter)
  assert(typeof htmlRender === 'string' || isStream(htmlRender))
  return { htmlRender, renderSrc }
}
