export { getViteDevScripts }

import type { ViteDevServer } from 'vite'
import { assert, assertUsage } from '../../utils'

type PageContext = {
  _isProduction: boolean
  _viteDevServer: null | ViteDevServer
  _baseUrl: string
  urlPathname: string
}

async function getViteDevScripts(pageContext: PageContext): Promise<string> {
  if (pageContext._isProduction) {
    return ''
  }
  assert(pageContext._viteDevServer)

  const fakeHtmlBegin = '<html> <head>' // White space to test whether user is using a minifier
  const fakeHtmlEnd = '</head><body></body></html>'
  let fakeHtml = fakeHtmlBegin + fakeHtmlEnd
  fakeHtml = await pageContext._viteDevServer.transformIndexHtml('/', fakeHtml)
  assertUsage(
    !fakeHtml.startsWith(fakeHtmlBegin.replace(' ', '')),
    'Vite plugins that minify the HTML are not supported by vite-plugin-ssr, see https://vite-plugin-ssr.com/html-minifiers',
  )
  assertUsage(
    fakeHtml.startsWith(fakeHtmlBegin) && fakeHtml.endsWith(fakeHtmlEnd),
    'You are using a Vite Plugin that transforms the HTML in a way that conflicts with vite-plugin-ssr. Create a new GitHub ticket to discuss a solution.',
  )
  const viteInjection = fakeHtml.slice(fakeHtmlBegin.length, -1 * fakeHtmlEnd.length)
  assert(viteInjection.includes('script'), { viteInjection })
  const scriptTags = viteInjection
  return scriptTags
}
