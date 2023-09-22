export { getViteDevScripts }

import { getGlobalContext } from '../../globalContext.js'
import { assert, assertUsage } from '../../utils.js'
import pc from '@brillout/picocolors'

async function getViteDevScripts(): Promise<string> {
  const globalContext = getGlobalContext()
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
    )} cannot be applied, see workaround at https://github.com/brillout/vike/issues/388#issuecomment-1199280084`
  )
  assertUsage(
    !fakeHtml.startsWith(fakeHtmlBegin.replace(' ', '')),
    'Vite plugins that minify the HTML are not supported by vike, see https://github.com/brillout/vike/issues/224'
  )
  assertUsage(
    fakeHtml.startsWith(fakeHtmlBegin) && fakeHtml.endsWith(fakeHtmlEnd),
    'You are using a Vite Plugin that transforms the HTML in a way that conflicts with vike. Create a new GitHub ticket to discuss a solution.'
  )
  const viteInjection = fakeHtml.slice(fakeHtmlBegin.length, -1 * fakeHtmlEnd.length)
  assert(viteInjection.includes('script'), { viteInjection })
  const scriptTags = viteInjection
  return scriptTags
}
