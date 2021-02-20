import { assert, assertUsage, cast } from './utils'

export { html }
export { getSanetizedHtml }

html.sanitize = sanitize
html.alreadySanitized = alreadySanitized

const __htmlTemplate = Symbol('__htmlTemplate')
const __htmlTemplateVariable = Symbol('__htmlTemplateVariable')

type HtmlTemplate = {
  [__htmlTemplate]: {
    templateParts: TemplateStringsArray
    templateVariables: unknown[]
  }
}
type SanetizedHtmlVariable = {
  [__htmlTemplateVariable]: string
}

function getSanetizedHtml(renderResult: unknown, filePath: string): string {
  assertUsage(
    typeof renderResult !== 'string',
    `The \`render\` function exported by ${filePath} returns a string that is not sanitized. Make sure to sanitize the string by using the \`html\` template string tag.`
  )
  cast<HtmlTemplate>(renderResult)
  assertUsage(
    renderResult && __htmlTemplate in renderResult,
    `The \`render\` function exported by ${filePath} should return a (sanitized) string.`
  )
  return renderTemplate(renderResult, filePath)
}

function html(
  templateParts: TemplateStringsArray,
  ...templateVariables: SanetizedHtmlVariable[]
) {
  return {
    [__htmlTemplate]: {
      templateParts,
      templateVariables
    }
  }
}

function renderTemplate(htmlTemplate: HtmlTemplate, filePath: string) {
  const { templateParts, templateVariables } = htmlTemplate[__htmlTemplate]
  const templateVariables__safe = templateVariables.map((templateVar) => {
    cast<SanetizedHtmlVariable>(templateVar)
    assertUsage(
      templateVar && __htmlTemplate in templateVar,
      `Not sanitized HTML variable: the \`render\` function exported by ${filePath} uses a HTML variable that is not sanitized. Make sure to call \`html.sanitize\` or \`html.alreadySanitized\` on each HTML template variable.`
    )
    const htmlVar = String(templateVar[__htmlTemplateVariable])
    return htmlVar
  })
  const htmlString = identityTemplateTag(
    templateParts,
    ...templateVariables__safe
  )
  return htmlString
}

function sanitize(unsafe: unknown) {
  const unsafeString = String(unsafe)
  return { [__htmlTemplateVariable]: escapeHtml(unsafeString) }
}
function alreadySanitized(safe: unknown) {
  return { [__htmlTemplateVariable]: safe }
}

function identityTemplateTag(
  templateParts: TemplateStringsArray,
  ...templateVariables: string[]
) {
  assert(templateParts.length === templateVariables.length + 1)
  let str = ''
  for (let i = 0; i < templateVariables.length; i++) {
    const templateVar = templateVariables[i]
    assert(typeof templateVar === 'string')
    str += templateParts[i] + templateVar
  }
  return str + templateParts[templateParts.length - 1]
}

// Source: https://stackoverflow.com/questions/6234773/can-i-escape-html-special-chars-in-javascript/6234804#6234804
function escapeHtml(unsafeString: string): string {
  const safe = unsafeString
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
  return safe
}
