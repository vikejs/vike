import { Html } from './types'
import { assertUsage } from './utils/assert'

export { renderHtmlTemplate }
export { Script }
export { injectScripts }

type Script = { scriptUrl: string } | { scriptContent: string }

function renderHtmlTemplate({
  htmlTemplate,
  pageViewHtml,
  preloadLinks,
  scripts,
  initialProps
}: {
  htmlTemplate: string
  pageViewHtml: string
  preloadLinks: string[]
  scripts: Script[]
  initialProps: Record<string, string>
}): Html {
  let html = injectValue(htmlTemplate, 'viewHtml', pageViewHtml, {
    alreadySanetized: true
  })

  Object.entries(initialProps).forEach(([varName, varValue]) => {
    assertUsage(typeof varValue === 'string', 'TODO')
    html = injectValue(html, varName, varValue)
  })

  html = injectScripts(html, scripts)

  html = injectValue(html, 'preloadLinks', preloadLinks.join('\n'), {
    alreadySanetized: true
  })

  return html
}

function injectScripts(html: string, scripts: Script[]): string {
  const htmlScritps: string[] = []
  scripts.forEach((script) => {
    if ('scriptUrl' in script) {
      htmlScritps.push(
        `<script type="module" src="${sanetize(script.scriptUrl)}"></script>`
      )
    }
    if ('scriptContent' in script) {
      htmlScritps.push(script.scriptContent)
    }
  })
  html = injectValue(html, 'scripts', htmlScritps.join('\n'), {
    alreadySanetized: true
  })
  return html
}

function injectValue(
  html: string,
  varName: string,
  varValue: string,
  { alreadySanetized }: { alreadySanetized?: boolean } = {}
): string {
  if (!alreadySanetized) {
    varValue = sanetize(varValue)
  }
  html = html.split('$' + varName).join(varValue)
  return html
}

function sanetize(unsafe: string): string {
  return escapeHtml(unsafe)
}

function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
