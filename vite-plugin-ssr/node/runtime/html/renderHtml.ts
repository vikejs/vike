// Public
export { escapeInject }
export { dangerouslySkipEscape }
export type { TemplateWrapped } // https://github.com/brillout/vite-plugin-ssr/issues/511

// Private
export { renderDocumentHtml }
export { isDocumentHtml }
export { getHtmlString }
export type { HtmlRender }
export type { HtmlPart }
export type { DocumentHtml }

import { assert, assertUsage, assertWarning, checkType, hasProp, isHtml, isPromise, objectAssign } from '../utils.js'
import { injectHtmlTagsToString, injectHtmlTagsToStream } from './injectAssets.js'
import type { PageContextInjectAssets } from './injectAssets.js'
import {
  processStream,
  isStream,
  StreamProviderAny,
  streamToString,
  StreamTypePatch,
  StreamProviderNormalized
} from './stream.js'
import { isStreamReactStreaming } from './stream/react-streaming.js'
import type { InjectToStream } from './stream/react-streaming.js'
import type { PageAsset } from '../renderPage/getPageAssets.js'
import type { PreloadFilter } from './injectAssets/getHtmlTags.js'
import { getGlobalContext } from '../globalContext.js'

type DocumentHtml = TemplateWrapped | EscapedString | StreamProviderAny
type HtmlRender = string | StreamProviderNormalized

type TemplateStrings = TemplateStringsArray
type TemplateVariable = string | EscapedString | StreamProviderAny | TemplateWrapped
type TemplateWrapped = {
  _template: TemplateContent
}
type TemplateContent = {
  templateStrings: TemplateStrings
  templateVariables: TemplateVariable[]
}

function isDocumentHtml(something: unknown): something is DocumentHtml {
  if (isTemplateWrapped(something) || isEscapedString(something) || isStream(something)) {
    checkType<DocumentHtml>(something)
    return true
  }
  return false
}

async function renderDocumentHtml(
  documentHtml: DocumentHtml,
  pageContext: PageContextInjectAssets,
  onErrorWhileStreaming: (err: unknown) => void,
  injectFilter: PreloadFilter
): Promise<HtmlRender> {
  if (isEscapedString(documentHtml)) {
    objectAssign(pageContext, { _isStream: false as const })
    let htmlString = getEscapedString(documentHtml)
    htmlString = await injectHtmlTagsToString([htmlString], pageContext, injectFilter)
    return htmlString
  }
  if (isStream(documentHtml)) {
    objectAssign(pageContext, { _isStream: true as const })
    const stream = documentHtml
    const streamWrapper = await renderHtmlStream(stream, null, pageContext, onErrorWhileStreaming, injectFilter)
    return streamWrapper
  }
  if (isTemplateWrapped(documentHtml)) {
    const templateContent = documentHtml._template
    const render = await renderTemplate(templateContent, pageContext)
    if (!('htmlStream' in render)) {
      objectAssign(pageContext, { _isStream: false as const })
      const { htmlPartsAll } = render
      const htmlString = await injectHtmlTagsToString(htmlPartsAll, pageContext, injectFilter)
      return htmlString
    } else {
      objectAssign(pageContext, { _isStream: true as const })
      const { htmlStream } = render
      const streamWrapper = await renderHtmlStream(
        htmlStream,
        {
          htmlPartsBegin: render.htmlPartsBegin,
          htmlPartsEnd: render.htmlPartsEnd
        },
        pageContext,
        onErrorWhileStreaming,
        injectFilter
      )
      return streamWrapper
    }
  }
  checkType<never>(documentHtml)
  assert(false)
}

async function renderHtmlStream(
  streamOriginal: StreamProviderAny & { injectionBuffer?: string[] },
  injectString: null | { htmlPartsBegin: HtmlPart[]; htmlPartsEnd: HtmlPart[] },
  pageContext: PageContextInjectAssets & { enableEagerStreaming?: boolean; _isStream: true },
  onErrorWhileStreaming: (err: unknown) => void,
  injectFilter: PreloadFilter
) {
  const opts = {
    onErrorWhileStreaming,
    enableEagerStreaming: pageContext.enableEagerStreaming
  }
  if (injectString) {
    let injectToStream: null | InjectToStream = null
    if (isStreamReactStreaming(streamOriginal) && !streamOriginal.disabled) {
      injectToStream = streamOriginal.injectToStream
    }
    const { injectAtStreamBegin, injectAtStreamEnd } = injectHtmlTagsToStream(pageContext, injectToStream, injectFilter)
    objectAssign(opts, {
      injectStringAtBegin: async () => {
        return await injectAtStreamBegin(injectString.htmlPartsBegin)
      },
      injectStringAtEnd: async () => {
        return await injectAtStreamEnd(injectString.htmlPartsEnd)
      }
    })
  }
  const streamWrapper = await processStream(streamOriginal, opts)
  return streamWrapper
}

function isTemplateWrapped(something: unknown): something is TemplateWrapped {
  return hasProp(something, '_template')
}
function isEscapedString(something: unknown): something is EscapedString {
  const result = hasProp(something, '_escaped')
  if (result) {
    assert(hasProp(something, '_escaped', 'string'))
    checkType<EscapedString>(something)
  }
  return result
}

function getEscapedString(escapedString: EscapedString): string {
  let htmlString: string
  assert(hasProp(escapedString, '_escaped'))
  htmlString = escapedString._escaped
  assert(typeof htmlString === 'string')
  return htmlString
}

function escapeInject(
  templateStrings: TemplateStrings,
  ...templateVariables: (TemplateVariable | StreamTypePatch)[]
): TemplateWrapped {
  assertUsage(
    templateStrings.length === templateVariables.length + 1 && templateStrings.every((str) => typeof str === 'string'),
    'You seem to use `escapeInject` as a function, but `escapeInject` is a string template tag, see https://vite-plugin-ssr.com/escapeInject',
    { showStackTrace: true }
  )
  return {
    _template: {
      templateStrings,
      templateVariables: templateVariables as TemplateVariable[]
    }
  }
}
type EscapedString = { _escaped: string }
function dangerouslySkipEscape(alreadyEscapedString: string): EscapedString {
  return _dangerouslySkipEscape(alreadyEscapedString)
}
function _dangerouslySkipEscape(arg: unknown): EscapedString {
  if (hasProp(arg, '_escaped')) {
    assert(isEscapedString(arg))
    return arg
  }
  assertUsage(
    !isPromise(arg),
    `[dangerouslySkipEscape(str)] Argument \`str\` is a promise. It should be a string instead (or a stream). Make sure to \`await str\`.`,
    { showStackTrace: true }
  )
  if (typeof arg === 'string') {
    return { _escaped: arg }
  }
  assertWarning(
    false,
    `[dangerouslySkipEscape(str)] Argument \`str\` should be a string but we got \`typeof str === "${typeof arg}"\`.`,
    {
      onlyOnce: false,
      showStackTrace: true
    }
  )
  return { _escaped: String(arg) }
}

// Currently, `HtmlPart` is always a `string`. But we may need string-returning-functions for advanced stream integrations such as RSC.
type HtmlPart = string | ((pageAssets: PageAsset[]) => string)

async function renderTemplate(
  templateContent: TemplateContent,
  pageContext: PageContextInjectAssets
): Promise<
  { htmlPartsAll: HtmlPart[] } | { htmlStream: StreamProviderAny; htmlPartsBegin: HtmlPart[]; htmlPartsEnd: HtmlPart[] }
> {
  const htmlPartsBegin: HtmlPart[] = []
  const htmlPartsEnd: HtmlPart[] = []
  let htmlStream: null | StreamProviderAny = null

  const addHtmlPart = (htmlPart: HtmlPart) => {
    if (htmlStream === null) {
      htmlPartsBegin.push(htmlPart)
    } else {
      htmlPartsEnd.push(htmlPart)
    }
  }

  const setStream = (stream: StreamProviderAny) => {
    const { hookName, hookFilePath } = pageContext._renderHook
    assertUsage(
      !htmlStream,
      `Injecting two streams in \`escapeInject\` template tag of ${hookName}() hook defined by ${hookFilePath}. Inject only one stream instead.`
    )
    htmlStream = stream
  }

  const { templateStrings, templateVariables } = templateContent
  for (let i = 0; i < templateVariables.length; i++) {
    addHtmlPart(templateStrings[i]!)
    let templateVar = templateVariables[i]

    // Process `dangerouslySkipEscape()`
    if (isEscapedString(templateVar)) {
      const htmlString = getEscapedString(templateVar)
      // User used `dangerouslySkipEscape()` so we assume the string to be safe
      addHtmlPart(htmlString)
      continue
    }

    // Process `escapeInject` fragments
    if (isTemplateWrapped(templateVar)) {
      const templateContentInner = templateVar._template
      const result = await renderTemplate(templateContentInner, pageContext)
      if (!('htmlStream' in result)) {
        result.htmlPartsAll.forEach(addHtmlPart)
      } else {
        result.htmlPartsBegin.forEach(addHtmlPart)
        setStream(result.htmlStream)
        result.htmlPartsEnd.forEach(addHtmlPart)
      }
      continue
    }

    if (isStream(templateVar)) {
      setStream(templateVar)
      continue
    }

    const getErrMsg = (typeText: string, end: null | string) => {
      const { hookName, hookFilePath } = pageContext._renderHook
      const nth: string = (i === 0 && '1st') || (i === 1 && '2nd') || (i === 2 && '3rd') || `${i}-th`
      return [`The ${nth} HTML variable is ${typeText}, see ${hookName}() hook defined by ${hookFilePath}.`, end]
        .filter(Boolean)
        .join(' ')
    }

    assertUsage(!isPromise(templateVar), getErrMsg('a promise', 'Did you forget to `await` the promise?'))

    if (templateVar === undefined || templateVar === null) {
      assertWarning(
        false,
        getErrMsg(
          `\`${templateVar}\` which will be converted to an empty string`,
          `Pass an empty string instead of \`${templateVar}\` to remove this warning.`
        ),
        { onlyOnce: false }
      )
      templateVar = ''
    }

    {
      const varType = typeof templateVar
      const streamNote = ['boolean', 'number', 'bigint', 'symbol'].includes(varType)
        ? null
        : '(See https://vite-plugin-ssr.com/stream for HTML streaming.)'
      assertUsage(varType === 'string', getErrMsg(`\`typeof htmlVar === "${varType}"\``, streamNote))
    }

    {
      const { isProduction } = getGlobalContext()
      if (isHtml(templateVar) && !isProduction) {
        assertWarning(
          false,
          getErrMsg(
            `\`${templateVar}\` which seems to be HTML code`,
            'Did you forget to wrap the value with dangerouslySkipEscape()?'
          ),
          { onlyOnce: false }
        )
      }
    }

    // Escape untrusted template variable
    addHtmlPart(escapeHtml(templateVar))
  }

  assert(templateStrings.length === templateVariables.length + 1)
  addHtmlPart(templateStrings[templateStrings.length - 1]!)

  if (htmlStream === null) {
    assert(htmlPartsEnd.length === 0)
    return {
      htmlPartsAll: htmlPartsBegin
    }
  }

  return {
    htmlStream,
    htmlPartsBegin,
    htmlPartsEnd
  }
}

function escapeHtml(unsafeString: string): string {
  // Source: https://stackoverflow.com/questions/6234773/can-i-escape-html-special-chars-in-javascript/6234804#6234804
  const safe = unsafeString
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
  return safe
}

async function getHtmlString(htmlRender: HtmlRender): Promise<string> {
  if (typeof htmlRender === 'string') {
    return htmlRender
  }
  if (isStream(htmlRender)) {
    return streamToString(htmlRender)
  }
  checkType<never>(htmlRender)
  assert(false)
}
