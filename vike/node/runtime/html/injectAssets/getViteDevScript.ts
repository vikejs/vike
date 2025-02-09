export { getViteDevScript }

import { getGlobalContext } from '../../globalContext.js'
import { assert, assertUsage, assertWarning } from '../../utils.js'
import pc from '@brillout/picocolors'

async function getViteDevScript(): Promise<string> {
  const globalContext = await getGlobalContext()
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
    'Vite plugins that minify the HTML are not supported by vike, see https://github.com/vikejs/vike/issues/224'
  )
  assertUsage(
    fakeHtml.startsWith(fakeHtmlBegin) && fakeHtml.endsWith(fakeHtmlEnd),
    'You are using a Vite Plugin that transforms the HTML in a way that conflicts with vike. Create a new GitHub ticket to discuss a solution.'
  )
  const viteInjection = fakeHtml.slice(fakeHtmlBegin.length, -1 * fakeHtmlEnd.length)
  assert(viteInjection.includes('script'))
  assertWarning(
    !viteInjection.includes('import('),
    'Unexpected Vite HMR code. Reach out to a Vike maintainer on GitHub.',
    { onlyOnce: true }
  )

  const viteDevScript = viteInjection
  return viteDevScript
}
