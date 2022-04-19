export { addViteDevScripts }

import type { ViteDevServer } from 'vite'
import { assert, assertUsage } from '../../utils'
import { parseScripts } from './parseScripts'

async function addViteDevScripts(
  scriptTag: string,
  pageContext: { _isProduction: boolean; _viteDevServer: null | ViteDevServer; _baseUrl: string; urlPathname: string },
): Promise<string> {
  if (pageContext._isProduction) {
    return scriptTag
  }
  assert(pageContext._viteDevServer)

  const fakeHtmlBegin = '<html> <head>'
  const fakeHtmlEnd = '</head><body></body></html>'
  let fakeHtml = fakeHtmlBegin + fakeHtmlEnd
  fakeHtml = await pageContext._viteDevServer.transformIndexHtml('/', fakeHtml)
  assertUsage(
    !fakeHtml.startsWith(fakeHtmlBegin.replace(' ', '')),
    'Vite plugins that minify the HTML are not supported by vite-plugin-ssr, see https://vite-plugin-ssr.com/html-minifiers',
  )
  assertUsage(
    fakeHtml.startsWith(fakeHtmlBegin) && fakeHtml.endsWith(fakeHtmlEnd),
    'You are using a Vite Plugin that transforms the HTML in a way that conflicts with vite-plugin-ssr. Open a new GitHub ticket to discuss a solution.',
  )
  const viteHead = fakeHtml.slice(fakeHtmlBegin.length, -1 * fakeHtmlEnd.length)
  assert(viteHead.includes('script'), { viteHead })
  const scriptTags = viteHead + scriptTag
  scriptTag = mergeScriptTags(scriptTags)
  return scriptTag
}

function mergeScriptTags(scriptTags: string): string {
  let scriptsES5 = ''
  const scriptsModuleContent: string[] = []

  const scripts = parseScripts(scriptTags)
  scripts.forEach(({ src, isModule, innerHtml, outerHtml }) => {
    if (!isModule) {
      scriptsES5 += outerHtml
    } else {
      if (src) {
        scriptsModuleContent.push(`import ${JSON.stringify(src)};`)
      } else if (innerHtml.trim()) {
        innerHtml = innerHtml.split('\n').filter(Boolean).join('\n')
        scriptsModuleContent.push(innerHtml)
      }
    }
  })

  assert(scriptsModuleContent.length > 0, { scriptTags })
  const scriptsModule = `<script type="module" async>\n${scriptsModuleContent.join('\n')}\n</script>`
  return scriptsModule + scriptsES5
}
