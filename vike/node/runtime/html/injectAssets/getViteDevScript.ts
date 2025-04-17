export { getViteDevScript }

import type { GlobalContextInternal } from '../../globalContext.js'
import { assert, assertUsage, assertWarning } from '../../utils.js'
import pc from '@brillout/picocolors'

const reachOutCTA = 'Create a new GitHub issue to discuss a solution.'

async function getViteDevScript(pageContext: {
  _globalContext: GlobalContextInternal
}): Promise<string> {
  const globalContext = pageContext._globalContext
  if (globalContext.isProduction) {
    return ''
  }
  const { viteDevServer } = globalContext

  const fakeHtmlBegin = '<html> <head>' // White space to test whether user is using a minifier
  const fakeHtmlEnd = '</head><body></body></html>'
  let fakeHtml = fakeHtmlBegin + fakeHtmlEnd
  fakeHtml = await viteDevServer.transformIndexHtml('/', fakeHtml)
  assertUsage(
    !fakeHtml.includes('vite-plugin-pwa'),
    `The HTML transformer of ${pc.cyan(
      'vite-plugin-pwa'
    )} cannot be applied, see workaround at https://github.com/vikejs/vike/issues/388#issuecomment-1199280084`
  )
  assertUsage(
    !fakeHtml.startsWith(fakeHtmlBegin.replace(' ', '')),
    `Vite plugins that minify the HTML cannot be applied, see https://github.com/vikejs/vike/issues/224`
  )
  assertUsage(
    fakeHtml.startsWith(fakeHtmlBegin) && fakeHtml.endsWith(fakeHtmlEnd),
    `You are using a Vite Plugin that transforms the HTML in a way that conflicts with Vike. ${reachOutCTA}`
  )
  const viteInjection = fakeHtml.slice(fakeHtmlBegin.length, -1 * fakeHtmlEnd.length)
  assert(viteInjection.includes('script'))
  assertWarning(!viteInjection.includes('import('), `Unexpected Vite injected HMR code. ${reachOutCTA}`, {
    onlyOnce: true
  })

  const viteDevScript = viteInjection
  return viteDevScript
}
