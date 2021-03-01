import { assert, assertUsage, cast, hasProp } from './utils'

export { html }
export { getSanitizedHtml }

html.dangerouslySetHtml = dangerouslySetHtml

const __html_template = Symbol('__html_template')
const __already_sanitized_string = Symbol('__already_sanitized_string')

type SanitizedHtmlString = {
  [__html_template]: {
    templateParts: TemplateStringsArray
    templateVariables: (
      | any
      | {
          [__already_sanitized_string]: string
        }
    )[]
  }
}
type TemplateString = TemplateStringsArray
function html(
  templateString: TemplateString,
  ...templateVariables: (string | ReturnType<typeof html.dangerouslySetHtml>)[]
): SanitizedHtmlString {
  return {
    [__html_template]: {
      templateParts: templateString,
      templateVariables
    }
  }
}
type SanitizedString = { [__already_sanitized_string]: string }
function dangerouslySetHtml(alreadySanitizedString: string): SanitizedString {
  return { [__already_sanitized_string]: alreadySanitizedString }
}

function getSanitizedHtml(renderResult: unknown, filePath: string): string {
  assertUsage(
    typeof renderResult !== 'string',
    `The \`render\` function exported by ${filePath} returned a string that is an unsafe. Make sure to return safe strings by using the \`html\` tag (\`import { html } from 'vite-plugin-ssr'\`).`
  )
  cast<{
    [__html_template]: {
      templateParts: TemplateStringsArray
      templateVariables: unknown[]
    }
  }>(renderResult)
  assertUsage(
    hasProp(renderResult, __html_template),
    `The \`render\` function exported by ${filePath} should return a string.`
  )
  const { templateParts, templateVariables } = renderResult[__html_template]
  const templateVariablesUnwrapped = templateVariables.map((templateVar) => {
    let templateVar__safe_string: string
    if (hasProp(templateVar, __already_sanitized_string)) {
      const varVal = templateVar[__already_sanitized_string]
      assertUsage(
        typeof varVal === 'string',
        `[html.dangerouslySetHtml(str)] Argument \`str\` should be a string but we got \`typeof str === "${typeof varVal}"\`.`
      )
      // User used `html.dangerouslySetHtml()` so we assume the string to be safe
      templateVar__safe_string = varVal
    } else {
      templateVar__safe_string = escapeHtml(String(templateVar))
    }
    return templateVar__safe_string
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
