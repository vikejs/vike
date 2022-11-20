import { assert, assertUsage, assertWarning, checkType, hasProp, isPromise, objectAssign } from '../utils'
import { injectAssets, injectAssetsToStream } from './injectAssets'
import type { PageContextInjectAssets } from './injectAssets'
import { processStream, isStream, Stream, streamToString, StreamTypePatch } from './stream'
import { isStreamReactStreaming } from './stream/react-streaming'
import type { InjectToStream } from 'react-streaming/server'

// Public
export { escapeInject }
export type { TemplateWrapped } // https://github.com/brillout/vite-plugin-ssr/issues/511
export { dangerouslySkipEscape }

// Private
export { renderHtml }
export { isDocumentHtml }
export { getHtmlString }
export type { HtmlRender }

type DocumentHtml = TemplateWrapped | EscapedString | Stream
type HtmlRender = string | Stream

type TemplateStrings = TemplateStringsArray
type TemplateVariable = string | EscapedString | Stream | TemplateWrapped
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

async function renderHtml(
  documentHtml: DocumentHtml,
  pageContext: PageContextInjectAssets,
  renderFilePath: string,
  onErrorWhileStreaming: (err: unknown) => void
): Promise<HtmlRender> {
  if (isEscapedString(documentHtml)) {
    let htmlString = getEscapedString(documentHtml)
    htmlString = await injectAssets(htmlString, pageContext)
    return htmlString
  }
  if (isStream(documentHtml)) {
    const stream = documentHtml
    const streamWrapper = await renderHtmlStream(stream, {
      pageContext,
      onErrorWhileStreaming
    })
    return streamWrapper
  }
  if (isTemplateWrapped(documentHtml)) {
    const templateContent = documentHtml._template
    const render = renderTemplate(templateContent, renderFilePath)
    if ('htmlString' in render) {
      let { htmlString } = render
      htmlString = await injectAssets(htmlString, pageContext)
      return htmlString
    } else {
      const streamWrapper = await renderHtmlStream(render.htmlStream, {
        injectString: {
          stringBegin: render.stringBegin,
          stringEnd: render.stringEnd
        },
        pageContext,
        onErrorWhileStreaming
      })
      return streamWrapper
    }
  }
  checkType<never>(documentHtml)
  assert(false)
}

async function renderHtmlStream(
  streamOriginal: Stream & { injectionBuffer?: string[] },
  {
    injectString,
    pageContext,
    onErrorWhileStreaming
  }: {
    injectString?: { stringBegin: string; stringEnd: string }
    pageContext: PageContextInjectAssets & { enableEagerStreaming?: boolean }
    onErrorWhileStreaming: (err: unknown) => void
  }
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
    const { injectAtStreamBegin, injectAtStreamEnd } = injectAssetsToStream(pageContext, injectToStream)
    objectAssign(opts, {
      injectStringAtBegin: async () => {
        return await injectAtStreamBegin(injectString.stringBegin)
      },
      injectStringAtEnd: async () => {
        return await injectAtStreamEnd(injectString.stringEnd)
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
    'You seem to use `escapeInject` as a function, but `escapeInject` is a string template tag, see https://vite-plugin-ssr.com/escapeInject'
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
    `[dangerouslySkipEscape(str)] Argument \`str\` is a promise. It should be a string instead. Make sure to \`await str\`.`
  )
  assertUsage(
    typeof arg === 'string',
    `[dangerouslySkipEscape(str)] Argument \`str\` should be a string but we got \`typeof str === "${typeof arg}"\`.`
  )
  return { _escaped: arg }
}

function renderTemplate(
  templateContent: TemplateContent,
  renderFilePath: string
): { htmlString: string } | { htmlStream: Stream; stringBegin: string; stringEnd: string } {
  let stringBegin = ''
  let htmlStream: null | Stream = null
  let stringEnd = ''

  const addString = (str: string) => {
    assert(typeof str === 'string')
    if (htmlStream === null) {
      stringBegin += str
    } else {
      stringEnd += str
    }
  }

  const setStream = (stream: Stream) => {
    assertUsage(
      !htmlStream,
      `Injecting two streams in \`escapeInject\` template tag of render() hook of ${renderFilePath}. Inject only one stream instead.`
    )
    htmlStream = stream
  }

  const { templateStrings, templateVariables } = templateContent
  for (let i = 0; i < templateVariables.length; i++) {
    addString(templateStrings[i]!)
    const templateVar = templateVariables[i]

    // Process `dangerouslySkipEscape()`
    if (isEscapedString(templateVar)) {
      const htmlString = getEscapedString(templateVar)
      // User used `dangerouslySkipEscape()` so we assume the string to be safe
      addString(htmlString)
      continue
    }

    // Process `escapeInject` fragments
    if (isTemplateWrapped(templateVar)) {
      const templateContentInner = templateVar._template
      const result = renderTemplate(templateContentInner, renderFilePath)
      if ('htmlString' in result) {
        addString(result.htmlString)
      } else {
        addString(result.stringBegin)
        setStream(result.htmlStream)
        addString(result.stringEnd)
      }
      continue
    }

    if (isStream(templateVar)) {
      setStream(templateVar)
      continue
    }

    const getErrMsg = (typeText: string, end: null | string) => {
      const nth: string = (i === 0 && '1st') || (i === 1 && '2nd') || (i === 2 && '3rd') || `${i}-th`
      return [
        `Each HTML variable should be a string (or a stream), but the ${nth} HTML variable is ${typeText}, see \`render()\` hook of ${renderFilePath}.`,
        end
      ]
        .filter(Boolean)
        .join(' ')
    }

    assertUsage(!isPromise(templateVar), getErrMsg('a promise', 'Did you forget to `await` the promise?'))

    if (templateVar === undefined || templateVar === null) {
      assertWarning(false, getErrMsg(`\`${templateVar}\``, ''), { onlyOnce: false })
      addString('')
      continue
    }

    {
      const varType = typeof templateVar
      const streamNote = ['boolean', 'number', 'bigint', 'symbol'].includes(varType)
        ? null
        : '(See https://vite-plugin-ssr.com/stream for HTML streaming.)'
      assertUsage(varType === 'string', getErrMsg(`\`typeof htmlVar === "${varType}"\``, streamNote))
    }

    // Escape untrusted template variable
    addString(escapeHtml(templateVar))
  }

  assert(templateStrings.length === templateVariables.length + 1)
  addString(templateStrings[templateStrings.length - 1]!)

  if (htmlStream === null) {
    assert(stringEnd === '')
    return {
      htmlString: stringBegin
    }
  }

  return {
    htmlStream,
    stringBegin,
    stringEnd
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
