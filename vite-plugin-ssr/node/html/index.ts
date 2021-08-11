import { assert, assertUsage, cast, hasProp, isPromise } from '../../shared/utils'
import { injectAssets } from './injectAssets'

export { html }
export { renderHtmlTemplate }
export { isHtmlTemplate }

export { isSanitizedString }
export { renderSanitizedString }

html.dangerouslySkipEscape = dangerouslySkipEscape
html._injectAssets = injectAssets

/* TS + Symbols are problematic: https://stackoverflow.com/questions/59118271/using-symbol-as-object-key-type-in-typescript
const __html_template = Symbol('__html_template')
const __dangerouslySkipEscape = Symbol('__dangerouslySkipEscape')
*/

type SanitizedHtmlString = {
  __html_template: {
    templateParts: TemplateStringsArray
    templateVariables: (
      | unknown
      | {
          __dangerouslySkipEscape: string
        }
    )[]
  }
}
type TemplateString = TemplateStringsArray
function html(
  templateString: TemplateString,
  ...templateVariables: (string | ReturnType<typeof html.dangerouslySkipEscape>)[]
): SanitizedHtmlString {
  return {
    __html_template: {
      templateParts: templateString,
      templateVariables
    }
  }
}
type SanitizedString = { __dangerouslySkipEscape: string } // todo: toString
function dangerouslySkipEscape(alreadySanitizedString: string): SanitizedString {
  assertUsage(
    !isPromise(alreadySanitizedString),
    `[html.dangerouslySkipEscape(str)] Argument \`str\` is a promise. It should be a string instead. Make sure to \`await str\`.`
  )
  assertUsage(
    typeof alreadySanitizedString === 'string',
    `[html.dangerouslySkipEscape(str)] Argument \`str\` should be a string but we got \`typeof str === "${typeof alreadySanitizedString}"\`.`
  )
  return { __dangerouslySkipEscape: alreadySanitizedString }
}

function isSanitizedString(something: unknown): something is SanitizedString {
  return hasProp(something, '__dangerouslySkipEscape')
}
function renderSanitizedString(renderResult: { __html_template: HtmlTemplate } | SanitizedString): string {
  let htmlString: string
  if ('__dangerouslySkipEscape' in renderResult) {
    htmlString = renderResult['__dangerouslySkipEscape']
  } else {
    assert(false)
  }
  assert(typeof htmlString === 'string')
  return htmlString
}

function isHtmlTemplate(something: unknown): something is { __html_template: HtmlTemplate } {
  return hasProp(something, '__html_template')
}
function renderHtmlTemplate(renderResult: { __html_template: HtmlTemplate }, filePath: string): string {
  let htmlString: string
  if ('__html_template' in renderResult) {
    htmlString = renderTemplate(renderResult['__html_template'], filePath)
  } else {
    assert(false)
  }
  assert(typeof htmlString === 'string')
  return htmlString
}

type HtmlTemplate = {
  templateParts: TemplateStringsArray
  templateVariables: unknown[]
}
function renderTemplate(htmlTemplate: HtmlTemplate, filePath: string) {
  const { templateParts, templateVariables } = htmlTemplate
  const templateVariablesUnwrapped: string[] = templateVariables.map((templateVar: unknown) => {
    // Process `html.dangerouslySkipEscape()`
    if (hasProp(templateVar, '__dangerouslySkipEscape')) {
      const val = templateVar['__dangerouslySkipEscape']
      assert(typeof val === 'string')
      // User used `html.dangerouslySkipEscape()` so we assume the string to be safe
      return val
    }

    // Process `html` tag composition
    if (hasProp(templateVar, '__html_template')) {
      const htmlTemplate__segment = templateVar['__html_template']
      cast<HtmlTemplate>(htmlTemplate__segment)
      return renderTemplate(htmlTemplate__segment, filePath)
    }

    // Process and sanitize untrusted template variable
    return escapeHtml(toString(templateVar))
  })
  const htmlString = identityTemplateTag(templateParts, ...templateVariablesUnwrapped)
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
