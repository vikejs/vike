export { executeOnRenderHtmlHook }
export type { RenderHook }

import {
  type HtmlRender,
  isDocumentHtml,
  renderDocumentHtml,
  DocumentHtml,
  dangerouslySkipEscape
} from '../html/renderHtml.js'
import { getHook, type Hook } from '../../../shared/hooks/getHook.js'
import {
  assert,
  assertUsage,
  assertWarning,
  isObject,
  objectAssign,
  isPromise,
  executeHook,
  isCallable
} from '../utils.js'
import type { PageAsset } from './getPageAssets.js'
import { isStream } from '../html/stream.js'
import { assertPageContextProvidedByUser } from '../../../shared/assertPageContextProvidedByUser.js'
import type { PreloadFilter } from '../html/injectAssets/getHtmlTags.js'
import {
  preparePageContextForUserConsumptionServerSide,
  type PageContextForUserConsumptionServerSide
} from './preparePageContextForUserConsumptionServerSide.js'
import type { PageContextPromise } from '../html/injectAssets.js'
import type { PageConfig } from '../../../shared/page-configs/PageConfig.js'
import { assertHookReturnedObject } from '../../../shared/assertHookReturnedObject.js'
import { logRuntimeError } from './loggerRuntime.js'
import type { PageContextSerialization } from '../html/serializePageContextClientSide.js'

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
  pageContext: PageContextForUserConsumptionServerSide &
    PageContextSerialization & {
      _pageId: string
      _pageConfigs: PageConfig[]
      __getPageAssets: GetPageAssets
      _isHtmlOnly: boolean
      _baseServer: string
      _pageFilePathsLoaded: string[]
      _httpRequestId: number | null
    }
): Promise<{
  renderHook: RenderHook
  htmlRender: null | HtmlRender
}> {
  const hookFound = getRenderHook(pageContext)
  const { renderHook, hookFn } = hookFound
  objectAssign(pageContext, { _renderHook: renderHook })

  preparePageContextForUserConsumptionServerSide(pageContext)
  const hookReturnValue = await executeHook(() => hookFn(pageContext), renderHook.hookName, renderHook.hookFilePath)
  const { documentHtml, pageContextProvidedByRenderHook, pageContextPromise, injectFilter } = processHookReturnValue(
    hookReturnValue,
    renderHook
  )

  Object.assign(pageContext, pageContextProvidedByRenderHook)
  objectAssign(pageContext, { _pageContextPromise: pageContextPromise })

  if (documentHtml === null || documentHtml === undefined) {
    return { htmlRender: null, renderHook }
  }

  const onErrorWhileStreaming = (err: unknown) => {
    // Should the stream inject the following?
    // ```
    // <script>console.error("An error occurred on the server while streaming the app to HTML. Check the server logs for more information.")</script>
    // ```
    logRuntimeError(err, pageContext._httpRequestId)
    if (!pageContext.errorWhileRendering) {
      pageContext.errorWhileRendering = err
    }
  }

  const htmlRender = await renderDocumentHtml(documentHtml, pageContext, onErrorWhileStreaming, injectFilter)
  assert(typeof htmlRender === 'string' || isStream(htmlRender))
  return { htmlRender, renderHook }
}

function getRenderHook(pageContext: PageContextForUserConsumptionServerSide) {
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
        `No ${hookName}() hook found, see https://vite-plugin-ssr.com/${hookName}`
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
  return hookFound
}

function processHookReturnValue(hookReturnValue: unknown, renderHook: RenderHook) {
  let documentHtml: null | DocumentHtml = null
  let pageContextPromise: PageContextPromise = null
  let pageContextProvidedByRenderHook: null | Record<string, unknown> = null
  let injectFilter: PreloadFilter = null
  const ret = () => ({ documentHtml, pageContextProvidedByRenderHook, pageContextPromise, injectFilter })

  if (hookReturnValue === null) return ret()

  if (isDocumentHtml(hookReturnValue)) {
    documentHtml = hookReturnValue
    return ret()
  }

  const errPrefix = `The ${renderHook.hookName as string}() hook defined at ${renderHook.hookFilePath}` as const
  const errSuffix =
    'a string generated with the escapeInject`<html>...</html>` template tag or a string returned by dangerouslySkipEscape(), see https://vite-plugin-ssr.com/escapeInject' as const
  if (typeof hookReturnValue === 'string') {
    assertWarning(
      false,
      [errPrefix, 'returned a plain JavaScript string which is dangerous: it should instead return', errSuffix].join(
        ' '
      ),
      { onlyOnce: true }
    )
    hookReturnValue = dangerouslySkipEscape(hookReturnValue)
  }
  assertUsage(
    isObject(hookReturnValue),
    [
      errPrefix,
      'should return `null`, a value `documentHtml`, or an object `{ documentHtml, pageContext }` where `pageContext` is `undefined` or an object holding additional pageContext values, and where `documentHtml` is',
      errSuffix
    ].join(' ')
  )
  assertHookReturnedObject(hookReturnValue, ['documentHtml', 'pageContext', 'injectFilter'] as const, errPrefix)

  if (hookReturnValue.injectFilter) {
    assertUsage(isCallable(hookReturnValue.injectFilter), 'injectFilter should be a function')
    injectFilter = hookReturnValue.injectFilter
  }

  if (hookReturnValue.documentHtml) {
    let val = hookReturnValue.documentHtml
    const errBegin = `${errPrefix} returned \`{ documentHtml }\`, but documentHtml`
    if (typeof val === 'string') {
      assertWarning(
        false,
        [errBegin, 'is a plain JavaScript string which is dangerous: documentHtml should be', errSuffix].join(' '),
        { onlyOnce: true }
      )
      val = dangerouslySkipEscape(val)
    }
    assertUsage(isDocumentHtml(val), [errBegin, 'should be', errSuffix].join(' '))
    documentHtml = val
  }

  if (hookReturnValue.pageContext) {
    const val = hookReturnValue.pageContext
    const errBegin = `${errPrefix} returned \`{ pageContext }\`, but pageContext`
    if (isPromise(val) || isCallable(val)) {
      assertWarning(
        !isPromise(val),
        `${errBegin} is a promise which is deprecated in favor of async functions, see https://vite-plugin-ssr.com/stream#initial-data-after-stream-end`,
        { onlyOnce: true }
      )
      pageContextPromise = val
    } else {
      assertUsage(
        isObject(val),
        `${errBegin} should be an object or an async function, see https://vite-plugin-ssr.com/stream#initial-data-after-stream-end`
      )
      assertPageContextProvidedByUser(val, renderHook)
      pageContextProvidedByRenderHook = val
    }
  }

  return ret()
}
