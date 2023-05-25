export { executeOnRenderHtmlHook }
export type { RenderHook }

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
  isCallable,
  isPlainObject
} from '../utils'
import type { PageAsset } from './getPageAssets'
import { isStream } from '../html/stream'
import { assertPageContextProvidedByUser } from '../../../shared/assertPageContextProvidedByUser'
import type { PreloadFilter } from '../html/injectAssets/getHtmlTags'
import { logErrorWithVite } from './logError'
import { preparePageContextForRelease, type PageContextPublic } from './preparePageContextForRelease'
import type { PageContextPromise } from '../html/injectAssets'
import type { PageConfig } from '../../../shared/page-configs/PageConfig'
import { assertObjectKeys } from '../../../shared/assertObjectKeys'

type GetPageAssets = () => Promise<PageAsset[]>

type RenderHook = {
  hookFilePath: string
  hookName: HookName
}
type HookName =
  | 'onRenderHtml'
  // TODO/v1-release: remove this line + remove all occurences of string literal 'render' in source code
  | 'render'

async function executeOnRenderHtmlHook(
  pageContext: PageContextPublic & {
    _pageId: string
    _pageConfigs: PageConfig[]
    __getPageAssets: GetPageAssets
    _passToClient: string[]
    _isHtmlOnly: boolean
    _baseServer: string
    _pageFilePathsLoaded: string[]
  }
): Promise<{
  renderHook: RenderHook
  htmlRender: null | HtmlRender
}> {
  let hookFound:
    | undefined
    | {
        renderHook: RenderHook
        hookFn: Function
      }
  {
    let hook: null | Hook
    let hookName: undefined | HookName = undefined
    hook = getHook(pageContext, 'onRenderHtml')
    if (hook) {
      hookName = 'onRenderHtml'
    } else {
      hook = getHook(pageContext, 'render')
      if (hook) {
        hookName = 'render'
      }
    }
    if (hook) {
      assert(hookName)
      const { hookFilePath, hookFn } = hook
      hookFound = {
        hookFn,
        renderHook: { hookFilePath, hookName }
      }
    }
  }
  if (!hookFound) {
    const hookName = pageContext._pageConfigs.length > 0 ? 'onRenderHtml' : 'render'
    assertUsage(
      false,
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
  }
  const { renderHook, hookFn } = hookFound
  objectAssign(pageContext, { _renderHook: renderHook })
  preparePageContextForRelease(pageContext)
  const result = await callHookWithTimeout(() => hookFn(pageContext), renderHook.hookName, renderHook.hookFilePath)

  const { documentHtml, pageContextProvidedByRenderHook, pageContextPromise } = processReturnValue(result, renderHook)
  assert(documentHtml === undefined || documentHtml === null || isDocumentHtml(documentHtml))
  Object.assign(pageContext, pageContextProvidedByRenderHook)
  objectAssign(pageContext, { _pageContextPromise: pageContextPromise })

  if (documentHtml === null || documentHtml === undefined) {
    return { htmlRender: null, renderHook }
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

  const htmlRender = await renderDocumentHtml(documentHtml, pageContext, onErrorWhileStreaming, injectFilter)
  assert(typeof htmlRender === 'string' || isStream(htmlRender))
  return { htmlRender, renderHook }
}

function processReturnValue(result: unknown, renderHook: RenderHook) {
  if (isObject(result) && !isDocumentHtml(result)) {
    const { hookName, hookFilePath } = renderHook
    const errPrefix = `The ${hookName}() hook defined by ${hookFilePath}`
    assertUsage(isPlainObject(result), `${errPrefix} should return a plain JavaScript object.`)
    assertObjectKeys(result, ['documentHtml', 'pageContext', 'injectFilter'] as const, errPrefix)
    if ('pageContext' in result) {
      const resultPageContext = result['pageContext']
      if (!isPromise(resultPageContext) && !isCallable(resultPageContext)) {
        assertPageContextProvidedByUser(resultPageContext, { hook: renderHook })
      }
    }
  }
  /* TODO
  if (canBePromise && !isObject(pageContextProvidedByUser)) {
    assertUsage(
      isCallable(pageContextProvidedByUser) || isPromise(pageContextProvidedByUser),
      `${errPrefix} should be an object, or an async function https://vite-plugin-ssr.com/stream#initial-data-after-stream-end`
    )
    return
  }
  */

  const errPrefix = `The ${renderHook.hookName}() hook defined by ` + renderHook.hookFilePath

  let pageContextPromise: PageContextPromise = null
  let pageContextProvidedByRenderHook: null | Record<string, unknown> = null
  if (hasProp(result, 'pageContext')) {
    const resultPageContext = result.pageContext
    if (isPromise(resultPageContext) || isCallable(resultPageContext)) {
      assertWarning(
        !isPromise(resultPageContext),
        `${errPrefix} returns a pageContext promise which is deprecated in favor of returning a pageContext async function, see https://vite-plugin-ssr.com/stream#initial-data-after-stream-end`,
        { onlyOnce: true, showStackTrace: false }
      )
      pageContextPromise = resultPageContext
    } else {
      assertPageContextProvidedByUser(resultPageContext, { hook: renderHook })
      pageContextProvidedByRenderHook = resultPageContext
    }
  }

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
  return { documentHtml, pageContextProvidedByRenderHook, pageContextPromise }
}
