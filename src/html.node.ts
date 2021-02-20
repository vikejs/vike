import { assert, assertUsage, cast } from './utils'

export { html }
export { getSanetizedHtml }

html.sanitize = sanitize
html.alreadySanitized = alreadySanitized

const __sanitizedHtml = Symbol('__sanitizedHtml')

type SanetizedHtml = {
  [__sanitizedHtml]: string
}
type SanetizedHtmlVariable = {
  [__sanitizedHtml]: unknown
}

function getSanetizedHtml(sanitizedHtml: unknown): string {
  assertUsage(
    typeof sanitizedHtml !== 'string',
    "Not sanitized HTML. Make sure to use the `html` template string tag (`import { html } from 'vite-plugin-ssr';`)."
  )
  cast<SanetizedHtml>(sanitizedHtml)
  assertUsage(
    sanitizedHtml && __sanitizedHtml in sanitizedHtml,
    "Your `html` function should return HTML. It should retrun a `html` template string (`import { html } from 'vite-plugin-ssr';`)."
  )
  return sanitizedHtml[__sanitizedHtml]
}

function html(
  templateParts: TemplateStringsArray,
  ...templateVariables: SanetizedHtmlVariable[]
) {
  const templateVariables__safe = templateVariables.map((templateVar) => {
    assertUsage(
      templateVar && __sanitizedHtml in templateVar,
      'Not sanitized HTML. Make sure to call `html.sanitize` or `html.alreadySanitized` on each HTML template variable.'
    )
    const htmlVar = String(templateVar[__sanitizedHtml])
    return htmlVar
  })
  const htmlString = identityTemplateTag(
    templateParts,
    ...templateVariables__safe
  )
  return { [__sanitizedHtml]: htmlString }
}

function sanitize(unsafe: unknown) {
  const unsafeString = String(unsafe)
  return { [__sanitizedHtml]: escapeHtml(unsafeString) }
}
function alreadySanitized(safe: unknown) {
  return { [__sanitizedHtml]: safe }
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
