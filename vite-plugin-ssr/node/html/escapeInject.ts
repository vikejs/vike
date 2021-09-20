import { assert, assertUsage, cast, checkType, hasProp, isObject, isPromise } from '../../shared/utils'
import { injectAssets_internal } from './injectAssets'
import type { PageContextInjectAssets } from './injectAssets'
import {
  StreamReadableNode,
  StreamReadableWeb,
  StreamPipeWeb,
  StreamPipeNode,
  isStreamReadableWeb,
  isStreamReadableNode,
  streamReadableWebToString,
  streamReadableNodeToString
} from './stream'

// Public
export { escapeInject }
export { dangerouslySkipEscape }
export { pipeWebStream }
export { pipeNodeStream }

// Private
export { isEscapeInject }
export { renderEscapeInject }
export { getStreamPipeWeb }
export { getStreamPipeNode }
export { getHtmlString }
export type { EscapeResult }

type EscapeInject =
  | TemplateWrapped
  | EscapedString
  | StreamReadableWeb
  | StreamReadableNode
  | StreamPipeNodeWrapped
  | StreamPipeWebWrapped
type EscapeResult = string | StreamReadableWeb | StreamReadableNode | StreamPipeWebWrapped | StreamPipeNodeWrapped

const __template = Symbol('__template')
type TemplateStrings = TemplateStringsArray
type TemplateVariable =
  | string
  | EscapedString
  | StreamReadableWeb
  | StreamReadableNode
  | StreamPipeNodeWrapped
  | StreamPipeWebWrapped
  | TemplateWrapped
type TemplateWrapped = {
  [__template]: TemplateContent
}
type TemplateContent = {
  templateStrings: TemplateStringsArray
  templateVariables: TemplateVariable[]
}

function isEscapeInject(something: unknown): something is EscapeInject {
  if (
    isTemplateWrapped(something) ||
    isEscapedString(something) ||
    isStreamReadableWeb(something) ||
    isStreamReadableNode(something) ||
    isStreamPipeNode(something) ||
    isStreamPipeWeb(something)
  ) {
    checkType<EscapeInject>(something)
    return true
  }
  return false
}

async function renderEscapeInject(
  documentHtml: EscapeInject,
  pageContext: PageContextInjectAssets
): Promise<EscapeResult> {
  let htmlString: string
  if (isEscapedString(documentHtml)) {
    htmlString = getEscapedString(documentHtml)
  } else if (isTemplateWrapped(documentHtml)) {
    htmlString = renderTemplateString(documentHtml)
  } else {
    assert(false)
  }
  htmlString = await injectAssets_internal(htmlString, pageContext)
  return htmlString
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

function escapeInject(templateStrings: TemplateStrings, ...templateVariables: TemplateVariable[]): TemplateWrapped {
  return {
    [__template]: {
      templateStrings,
      templateVariables
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

function renderTemplateString(templateWrapped: TemplateWrapped): string {
  let htmlString: string
  if (__template in templateWrapped) {
    htmlString = renderTemplate(templateWrapped[__template])
  } else {
    assert(false)
  }
  assert(typeof htmlString === 'string')
  return htmlString
}

function renderTemplate(templateContent: TemplateContent) {
  const { templateStrings, templateVariables } = templateContent
  const templateVariablesUnwrapped: string[] = templateVariables.map((templateVar: unknown) => {
    // Process `dangerouslySkipEscape()`
    if (isEscapedString(templateVar)) {
      const val = templateVar[__escaped]
      assert(typeof val === 'string')
      // User used `dangerouslySkipEscape()` so we assume the string to be safe
      return val
    }

    // Process `escapeInject` tag composition
    if (hasProp(templateVar, __template)) {
      const htmlTemplate__segment = templateVar[__template]
      cast<TemplateContent>(htmlTemplate__segment)
      return renderTemplate(htmlTemplate__segment)
    }

    // Escape untrusted template variable
    return escapeHtml(toString(templateVar))
  })
  const htmlString = identityTemplateTag(templateStrings, ...templateVariablesUnwrapped)
  return htmlString
}

function identityTemplateTag(parts: TemplateStringsArray, ...variables: string[]) {
  assert(parts.length === variables.length + 1)
  let str = ''
  for (let i = 0; i < variables.length; i++) {
    const variable = variables[i]
    assert(typeof variable === 'string')
    str += parts[i] + variable
  }
  return str + parts[parts.length - 1]
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

const __streamPipeWeb = Symbol('__streamPipeWeb')
type StreamPipeWebWrapped = { [__streamPipeWeb]: StreamPipeWeb }
function pipeWebStream(pipe: StreamPipeWeb): StreamPipeWebWrapped {
  return { [__streamPipeWeb]: pipe }
}
function getStreamPipeWeb(escapeResult: StreamPipeWebWrapped): StreamPipeWeb
function getStreamPipeWeb(escapeResult: EscapeResult): null | StreamPipeWeb
function getStreamPipeWeb(escapeResult: EscapeResult): null | StreamPipeWeb {
  if (isStreamPipeWeb(escapeResult)) {
    return escapeResult[__streamPipeWeb]
  }
  return null
}
function isStreamPipeWeb(something: unknown): something is StreamPipeWebWrapped {
  return isObject(something) && __streamPipeWeb in something
}

const __streamPipeNode = Symbol('__streamPipeNode')
type StreamPipeNodeWrapped = { [__streamPipeNode]: StreamPipeNode }
function pipeNodeStream(pipe: StreamPipeNode): StreamPipeNodeWrapped {
  return { [__streamPipeNode]: pipe }
}
function getStreamPipeNode(escapeResult: StreamPipeNodeWrapped): StreamPipeNode
function getStreamPipeNode(escapeResult: EscapeResult): null | StreamPipeNode
function getStreamPipeNode(escapeResult: EscapeResult): null | StreamPipeNode {
  if (isStreamPipeNode(escapeResult)) {
    return escapeResult[__streamPipeNode]
  }
  return null
}
function isStreamPipeNode(something: unknown): something is StreamPipeNodeWrapped {
  return isObject(something) && __streamPipeNode in something
}

async function getHtmlString(escapeResult: EscapeResult): Promise<string> {
  if (typeof escapeResult === 'string') {
    return escapeResult
  }
  if (isStreamReadableWeb(escapeResult)) {
    return streamReadableWebToString(escapeResult)
  }
  if (isStreamReadableNode(escapeResult)) {
    return streamReadableNodeToString(escapeResult)
  }
  /*
  if (isStreamPipeNode(escapeResult)) {
    return streamToString(getStreamPipeNode(escapeResult))
  }
  if (isStreamPipeWeb(escapeResult)) {
    return streamToString(getStreamPipeWeb(escapeResult))
  }
  checkType<never>(escapeResult)
  */
  assert(false)
}
