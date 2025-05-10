export { executeOnRenderHtmlHook }
export type { RenderHook }

import {
  type HtmlRender,
  isDocumentHtml,
  renderDocumentHtml,
  DocumentHtml,
  dangerouslySkipEscape
} from '../html/renderHtml.js'
import { getHookFromPageContext, type Hook } from '../../../shared/hooks/getHook.js'
import { assert, assertUsage, assertWarning, isObject, objectAssign, isPromise, isCallable } from '../utils.js'
import type { PageAsset } from './getPageAssets.js'
import { isStream } from '../html/stream.js'
import { assertPageContextProvidedByUser } from '../../../shared/assertPageContextProvidedByUser.js'
import type { PreloadFilter } from '../html/injectAssets/getHtmlTags.js'
import {
  preparePageContextForPublicUsageServer,
  type PageContextForPublicUsageServer
} from './preparePageContextForPublicUsageServer.js'
import type { PageContextPromise } from '../html/injectAssets.js'
import type { PageConfigRuntime } from '../../../shared/page-configs/PageConfig.js'
import { assertHookReturnedObject } from '../../../shared/assertHookReturnedObject.js'
import { logRuntimeError } from './loggerRuntime.js'
import type { PageContextSerialization } from '../html/serializeContext.js'
import pc from '@brillout/picocolors'
import { execHookSingleWithReturn } from '../../../shared/hooks/execHook.js'
import type { GlobalContextServerInternal } from '../globalContext.js'

type GetPageAssets = () => Promise<PageAsset[]>

type RenderHook = Hook & { hookName: HookName }
type HookName =
  | 'onRenderHtml'
  // TODO/v1-release: remove this line + remove all occurences of string literal 'render' in source code
  | 'render'

async function executeOnRenderHtmlHook(
  pageContext: PageContextForPublicUsageServer &
    PageContextSerialization & {
      pageId: string
      _globalContext: GlobalContextServerInternal
      _pageConfigs: PageConfigRuntime[]
      __getPageAssets: GetPageAssets
      _isHtmlOnly: boolean
      _baseServer: string
      _pageFilePathsLoaded: string[]
      _httpRequestId: number | null
    }
): Promise<{
  renderHook: RenderHook
  htmlRender: HtmlRender
}> {
  const hook = getRenderHook(pageContext)
  objectAssign(pageContext, { _renderHook: hook })

  const { hookReturn } = await execHookSingleWithReturn(hook, pageContext, preparePageContextForPublicUsageServer)

  const { documentHtml, pageContextProvidedByRenderHook, pageContextPromise, injectFilter } = processHookReturnValue(
    hookReturn,
    hook
  )

  Object.assign(pageContext, pageContextProvidedByRenderHook)
  objectAssign(pageContext, { _pageContextPromise: pageContextPromise })

  const onErrorWhileStreaming = (err: unknown) => {
    // Should the stream inject the following?
    // ```
    // <script>console.error("An error occurred on the server side while streaming the page to HTML, see server logs.")</script>
    // ```
    logRuntimeError(err, pageContext._httpRequestId)
    if (!pageContext.errorWhileRendering) {
      pageContext.errorWhileRendering = err
    }
  }

  const htmlRender = await renderDocumentHtml(documentHtml, pageContext, onErrorWhileStreaming, injectFilter)
  assert(typeof htmlRender === 'string' || isStream(htmlRender))
  return { htmlRender, renderHook: hook }
}

function getRenderHook(
  pageContext: PageContextForPublicUsageServer & {
    _pageConfigs: PageConfigRuntime[]
  }
) {
  let hookFound: RenderHook | undefined
  {
    let hook: null | Hook
    let hookName: undefined | HookName = undefined
    hook = getHookFromPageContext(pageContext, 'onRenderHtml')
    if (hook) {
      hookName = 'onRenderHtml'
    } else {
      hook = getHookFromPageContext(pageContext, 'render')
      if (hook) {
        hookName = 'render'
      }
    }
    if (hook) {
      assert(hookName)
      const { hookFilePath, hookFn, hookTimeout } = hook
      hookFound = { hookFn, hookFilePath, hookName, hookTimeout }
    }
  }
  if (!hookFound) {
    const hookName = pageContext._pageConfigs.length > 0 ? 'onRenderHtml' : 'render'
    assertUsage(
      false,
      [
        `No ${hookName}() hook found, see https://vike.dev/${hookName}`
        /*
        'See https://vike.dev/render-modes for more information.',
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

function processHookReturnValue(
  hookReturnValue: unknown,
  renderHook: RenderHook
): {
  documentHtml: DocumentHtml
  pageContextPromise: PageContextPromise
  pageContextProvidedByRenderHook: null | Record<string, unknown>
  injectFilter: PreloadFilter
} {
  let documentHtml: DocumentHtml
  let pageContextPromise: PageContextPromise = null
  let pageContextProvidedByRenderHook: null | Record<string, unknown> = null
  let injectFilter: PreloadFilter = null

  if (isDocumentHtml(hookReturnValue)) {
    documentHtml = hookReturnValue
    return { documentHtml, pageContextProvidedByRenderHook, pageContextPromise, injectFilter }
  }

  const errPrefix = `The ${renderHook.hookName as string}() hook defined at ${renderHook.hookFilePath}` as const
  const errSuffix = `a string generated with ${pc.cyan(
    'escapeInject`<html>...</html>`'
  )} or the value returned by ${pc.cyan('dangerouslySkipEscape()')}, see https://vike.dev/escapeInject` as const
  if (typeof hookReturnValue === 'string') {
    assertWarning(
      false,
      [
        errPrefix,
        `returned a plain JavaScript string which is ${pc.red(pc.bold('dangerous'))}: it should instead return`,
        errSuffix
      ].join(' '),
      { onlyOnce: true }
    )
    hookReturnValue = dangerouslySkipEscape(hookReturnValue)
  }
  const wrongReturnValue = `should return the value ${pc.cyan('documentHtml')} or an object ${pc.cyan(
    '{ documentHtml }'
  )} where ${pc.cyan('documentHtml')} is ${errSuffix}` as const
  assertUsage(isObject(hookReturnValue), `${errPrefix} ${wrongReturnValue}`)
  assertHookReturnedObject(hookReturnValue, ['documentHtml', 'pageContext', 'injectFilter'] as const, errPrefix)
  assertUsage(
    hookReturnValue.documentHtml,
    `${errPrefix} returned an object that is missing the ${pc.code('documentHtml')} property: it ${wrongReturnValue}`
  )

  if (hookReturnValue.injectFilter) {
    assertUsage(isCallable(hookReturnValue.injectFilter), 'injectFilter should be a function')
    injectFilter = hookReturnValue.injectFilter
  }

  {
    let val = hookReturnValue.documentHtml
    const errBegin = `${errPrefix} returned ${pc.cyan('{ documentHtml }')}, but ${pc.cyan('documentHtml')}` as const
    if (typeof val === 'string') {
      assertWarning(
        false,
        [
          errBegin,
          `is a plain JavaScript string which is ${pc.bold(pc.red('dangerous'))}: ${pc.cyan('documentHtml')} should be`,
          errSuffix
        ].join(' '),
        { onlyOnce: true }
      )
      val = dangerouslySkipEscape(val)
    }
    assertUsage(isDocumentHtml(val), [errBegin, 'should be', errSuffix].join(' '))
    documentHtml = val
  }

  if (hookReturnValue.pageContext) {
    const val = hookReturnValue.pageContext
    const errBegin = `${errPrefix} returned ${pc.cyan('{ pageContext }')}, but ${pc.cyan('pageContext')}`
    if (isPromise(val) || isCallable(val)) {
      assertWarning(
        !isPromise(val),
        `${errBegin} is a promise which is deprecated in favor of async functions, see https://vike.dev/streaming#initial-data-after-stream-end`,
        { onlyOnce: true }
      )
      pageContextPromise = val
    } else {
      assertUsage(
        isObject(val),
        `${errBegin} should be an object or an async function, see https://vike.dev/streaming#initial-data-after-stream-end`
      )
      assertPageContextProvidedByUser(val, renderHook)
      pageContextProvidedByRenderHook = val
    }
  }

  return { documentHtml, pageContextProvidedByRenderHook, pageContextPromise, injectFilter }
}
