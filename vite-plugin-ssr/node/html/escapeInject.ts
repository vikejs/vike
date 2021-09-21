import { assert, assertUsage, checkType, hasProp, isPromise } from '../../shared/utils'
import { injectAssets_internal } from './injectAssets'
import type { PageContextInjectAssets } from './injectAssets'
import { addStringWrapperToStream, isStream, Stream, streamToString, StreamTypePatch } from './stream'

// Public
export { escapeInject }
export { dangerouslySkipEscape }

// Private
export { isEscapeInject }
export { renderEscapeInject }
export { getHtmlString }
export type { EscapeResult }

type EscapeInject = TemplateWrapped | EscapedString | Stream
type EscapeResult = string | Stream

const __template = Symbol('__template')
type TemplateStrings = TemplateStringsArray
type TemplateVariable = string | EscapedString | Stream | TemplateWrapped
type TemplateWrapped = {
  [__template]: TemplateContent
}
type TemplateContent = {
  templateStrings: TemplateStrings
  templateVariables: TemplateVariable[]
}

function isEscapeInject(something: unknown): something is EscapeInject {
  if (isTemplateWrapped(something) || isEscapedString(something) || isStream(something)) {
    checkType<EscapeInject>(something)
    return true
  }
  return false
}

async function renderEscapeInject(
  escapeInject: EscapeInject,
  pageContext: PageContextInjectAssets,
  renderFilePath: string
): Promise<EscapeResult> {
  if (isEscapedString(escapeInject)) {
    let htmlString = getEscapedString(escapeInject)
    htmlString = await injectAssets_internal(htmlString, pageContext)
    return htmlString
  }
  if (isStream(escapeInject)) {
    return escapeInject
  }
  if (isTemplateWrapped(escapeInject)) {
    const templateContent = escapeInject[__template]
    const render = renderTemplate(templateContent, renderFilePath)
    if (render.type === 'string') {
      let htmlString = render.value
      htmlString = await injectAssets_internal(htmlString, pageContext)
      return htmlString
    }
    if (render.type === 'stream') {
      const splitter = '<span>__VITE_PLUGIN_SSR__SPLITTER__</span>'
      let htmlWrapper = render.stringBegin + splitter + render.stringEnd
      htmlWrapper = await injectAssets_internal(htmlWrapper, pageContext)
      assertUsage(
        htmlWrapper.includes(splitter),
        "You are using an HTML transformer that conflicts with vite-plugin-ssr's HTML streaming support. Open a new GitHub ticket so we can discuss a solution."
      )
      const [stringBegin, stringEnd] = htmlWrapper.split(splitter)
      assert(stringEnd !== undefined && stringBegin !== undefined)
      const stream = addStringWrapperToStream(render.stream, stringBegin, stringEnd)
      return stream
    }
    checkType<never>(render)
    assert(false)
  }
  checkType<never>(escapeInject)
  assert(false)
}

function isTemplateWrapped(something: unknown): something is TemplateWrapped {
  return hasProp(something, __template)
}
function isEscapedString(something: unknown): something is EscapedString {
  const result = hasProp(something, __escaped)
  if (result) {
    assert(hasProp(something, __escaped, 'string'))
    checkType<EscapedString>(something)
  }
  return result
}

function getEscapedString(escapedString: EscapedString): string {
  let htmlString: string
  assert(hasProp(escapedString, __escaped))
  htmlString = escapedString[__escaped]
  assert(typeof htmlString === 'string')
  return htmlString
}

function escapeInject(templateStrings: TemplateStrings, ...templateVariables: (TemplateVariable | StreamTypePatch)[]): TemplateWrapped {
  return {
    [__template]: {
      templateStrings,
      templateVariables: (templateVariables as TemplateVariable[])
    }
  }
}
const __escaped = Symbol('__escaped')
type EscapedString = { [__escaped]: string }
function dangerouslySkipEscape(alreadyEscapedString: string): EscapedString {
  return _dangerouslySkipEscape(alreadyEscapedString)
}
function _dangerouslySkipEscape(arg: unknown): EscapedString {
  if (hasProp(arg, __escaped)) {
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
  return { [__escaped]: arg }
}

function renderTemplate(
  templateContent: TemplateContent,
  renderFilePath: string
): { type: 'string'; value: string } | { type: 'stream'; stream: Stream; stringBegin: string; stringEnd: string } {
  let stringBegin = ''
  let stream: null | Stream = null
  let stringEnd = ''

  const addString = (str: string) => {
    assert(typeof str === 'string')
    if (stream === null) {
      stringBegin += str
    } else {
      stringEnd += str
    }
  }

  const { templateStrings, templateVariables } = templateContent
  for (const i in templateVariables) {
    addString(templateStrings[i]!)
    const templateVar = templateVariables[i]

    // Process `dangerouslySkipEscape()`
    if (isEscapedString(templateVar)) {
      const htmlString = getEscapedString(templateVar)
      // User used `dangerouslySkipEscape()` so we assume the string to be safe
      addString(htmlString)
      continue
    }

    // Process `escapeInject` tag composition
    if (isTemplateWrapped(templateVar)) {
      const templateContentInner = templateVar[__template]
      const render = renderTemplate(templateContentInner, renderFilePath)
      assertUsage(
        !(stream !== null && render.type === 'stream'),
        `You are trying to eject two streams in your \`escapeInject\` template tag of your render() hook exported by ${renderFilePath}. Inject only one stream instead.`
      )
      if (render.type === 'string') {
        addString(render.value)
      } else if (render.type === 'stream') {
        addString(render.stringBegin)
        stream = render.stream
        addString(render.stringEnd)
      } else {
        assert(false)
      }
      continue
    }

    if (isStream(templateVar)) {
      stream = templateVar
      continue
    }

    // Escape untrusted template variable
    addString(escapeHtml(toString(templateVar)))
  }

  assert(templateStrings.length === templateVariables.length + 1)
  addString(templateStrings[templateStrings.length - 1]!)

  if (stream === null) {
    assert(stringEnd === '')
    return {
      type: 'string',
      value: stringBegin
    }
  }

  return {
    type: 'stream',
    stream,
    stringBegin,
    stringEnd
  }
}

function toString(val: unknown): string {
  if (val === null || val === undefined) {
    return ''
  }
  return String(val)
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

async function getHtmlString(escapeResult: EscapeResult): Promise<string> {
  if (typeof escapeResult === 'string') {
    return escapeResult
  }
  if (isStream(escapeResult)) {
    return streamToString(escapeResult)
  }
  checkType<never>(escapeResult)
  assert(false)
}
