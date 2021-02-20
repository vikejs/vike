import { assert, assertUsage, cast } from './utils'

export { html }
export { getSanitizedHtml }

html.sanitize = sanitize
html.dangerouslySetHtml = dangerouslySetHtml

const __template = Symbol('__template')
const __templateVar = Symbol('__templateVar')

type SanitizedHtmlString = {
  [__template]: {
    templateParts: TemplateStringsArray
    templateVariables: {
      [__templateVar]: any
    }[]
  }
}
type TemplateString = TemplateStringsArray
function html(
  templateString: TemplateString,
  ...templateVariables: ReturnType<
    typeof html.sanitize | typeof html.dangerouslySetHtml
  >[]
): SanitizedHtmlString {
  return {
    [__template]: {
      templateParts: templateString,
      templateVariables
    }
  }
}
type SanitizedString = { [__templateVar]: any; dangerouslySetHtml?: true }
function sanitize(unsafe: any): SanitizedString {
  return { [__templateVar]: unsafe }
}
function dangerouslySetHtml(safe: any): SanitizedString {
  return { [__templateVar]: safe, dangerouslySetHtml: true }
}

function getSanitizedHtml(renderResult: unknown, filePath: string): string {
  assertUsage(
    typeof renderResult !== 'string',
    `The \`render\` function exported by ${filePath} returns a string that is not sanitized. Make sure to sanitize the string by using the \`html\` template string tag.`
  )
  cast<{
    [__template]: {
      templateParts: TemplateStringsArray
      templateVariables: unknown[]
    }
  }>(renderResult)
  assertUsage(
    renderResult && __template in renderResult,
    `The \`render\` function exported by ${filePath} should return a (sanitized) string.`
  )
  const { templateParts, templateVariables } = renderResult[__template]
  const templateVariablesUnwrapped = templateVariables.map((templateVar) => {
    cast<SanitizedString>(templateVar)
    assertUsage(
      templateVar && __templateVar in templateVar,
      `Not sanitized HTML variable: the \`render\` function exported by ${filePath} uses a HTML variable that is not sanitized. Make sure to call \`html.sanitize\` or \`html.dangerouslySetHtml\` on each HTML template variable.`
    )
    const unsafe = templateVar[__templateVar]
    const safe = templateVar.dangerouslySetHtml
      ? unsafe
      : escapeHtml(String(unsafe))
    return safe
  })
  const htmlString = identityTemplateTag(
    templateParts,
    ...templateVariablesUnwrapped
  )
  return htmlString
}

function identityTemplateTag(
  parts: TemplateStringsArray,
  ...variables: string[]
) {
  assert(parts.length === variables.length + 1)
  let str = ''
  for (let i = 0; i < variables.length; i++) {
    const variable = variables[i]
    assert(typeof variable === 'string')
    str += parts[i] + variable
  }
  return str + parts[parts.length - 1]
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
