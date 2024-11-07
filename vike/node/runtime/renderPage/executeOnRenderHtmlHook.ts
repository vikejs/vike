export { executeOnRenderHtmlHook }
export type { RenderHook }

import {
  type HtmlRender,
  isDocumentHtml,
  renderDocumentHtml,
  DocumentHtml,
  dangerouslySkipEscape
} from '../html/renderHtml'
import { getHook, type Hook } from '../../../shared/hooks/getHook'
import { assert, assertUsage, assertWarning, isObject, objectAssign, isPromise, isCallable } from '../utils'
import type { PageAsset } from './getPageAssets'
import { isStream } from '../html/stream'
import { assertPageContextProvidedByUser } from '../../../shared/assertPageContextProvidedByUser'
import type { PreloadFilter } from '../html/injectAssets/getHtmlTags'
import {
  preparePageContextForUserConsumptionServerSide,
  type PageContextForUserConsumptionServerSide
} from './preparePageContextForUserConsumptionServerSide'
import type { PageContextPromise } from '../html/injectAssets'
import type { PageConfigRuntime } from '../../../shared/page-configs/PageConfig'
import { assertHookReturnedObject } from '../../../shared/assertHookReturnedObject'
import { logRuntimeError } from './loggerRuntime'
import type { PageContextSerialization } from '../html/serializePageContextClientSide'
import pc from '@brillout/picocolors'
import { executeHook } from '../../../shared/hooks/executeHook'

type GetPageAssets = () => Promise<PageAsset[]>

type RenderHook = Hook & { hookName: HookName }
type HookName =
  | 'onRenderHtml'
  // TODO/v1-release: remove this line + remove all occurences of string literal 'render' in source code
  | 'render'

async function executeOnRenderHtmlHook(
  pageContext: PageContextForUserConsumptionServerSide &
    PageContextSerialization & {
      pageId: string
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
  const { renderHook, hookFn } = getRenderHook(pageContext)
  objectAssign(pageContext, { _renderHook: renderHook })

  preparePageContextForUserConsumptionServerSide(pageContext)
  const hookReturnValue = await executeHook(() => hookFn(pageContext), renderHook, pageContext)
  const { documentHtml, pageContextProvidedByRenderHook, pageContextPromise, injectFilter } = processHookReturnValue(
    hookReturnValue,
    renderHook
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
      const { hookFilePath, hookFn, hookTimeout } = hook
      hookFound = {
        hookFn,
        renderHook: { hookFn, hookFilePath, hookName, hookTimeout }
      }
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

function processHookReturnValue(hookReturnValue: unknown, renderHook: RenderHook) {
  let documentHtml: DocumentHtml
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
  const errSuffix = `a string generated with the ${pc.cyan(
    'escapeInject`<html>...</html>`'
  )} template tag or a string returned by ${pc.cyan(
    'dangerouslySkipEscape()'
  )}, see https://vike.dev/escapeInject` as const
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
      `should return ${pc.cyan('null')}, the value ${pc.cyan('documentHtml')}, or an object ${pc.cyan(
        '{ documentHtml, pageContext }'
      )} where ${pc.cyan('pageContext')} is ${pc.cyan(
        'undefined'
      )} or an object holding additional pageContext values, and where ${pc.cyan('documentHtml')} is`,
      errSuffix
    ].join(' ')
  )
  assertHookReturnedObject(hookReturnValue, ['documentHtml', 'pageContext', 'injectFilter'] as const, errPrefix)

  if (hookReturnValue.injectFilter) {
    assertUsage(isCallable(hookReturnValue.injectFilter), 'injectFilter should be a function')
    injectFilter = hookReturnValue.injectFilter
  }

  assertUsage(
    hookReturnValue.documentHtml,
    `${errPrefix} returned an object that is missing the ${pc.code('documentHtml')} property.`
  )
  {
    let val = hookReturnValue.documentHtml
    const errBegin = `${errPrefix} returned ${pc.cyan('{ documentHtml }')}, but ${pc.cyan('documentHtml')}` as const
    if (typeof val === 'string') {
      assertWarning(
        false,
        [
          errBegin,
          `is a plain JavaScript string which is dangerous: ${pc.cyan('documentHtml')} should be`,
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

  return ret()
}
