export { mergeScriptTags }

import { assert } from '../../utils.js'
import { inferNonceAttr, type PageContextCspNonce, scriptAttrs } from './inferHtmlTags.js'

const scriptRE = /(<script\b(?:\s[^>]*>|>))(.*?)<\/script>/gims
const srcRE = /\bsrc\s*=\s*(?:"([^"]+)"|'([^']+)'|([^\s'">]+))/im
const typeRE = /\btype\s*=\s*(?:"([^"]+)"|'([^']+)'|([^\s'">]+))/im

function mergeScriptTags(scriptTagsHtml: string, pageContext: PageContextCspNonce): string {
  let scriptTag = ''

  const scripts = parseScripts(scriptTagsHtml)

  // We need to merge module scripts to ensure execution order
  {
    const scriptsModule = scripts.filter(({ isModule }) => isModule)
    if (scriptsModule.length === 1) {
      scriptTag += scriptsModule[0]!.outerHtml
    } else {
      const contents: string[] = []
      scriptsModule.forEach(({ src, innerHtml }) => {
        const hasInnerHtml = !!innerHtml.trim()
        if (src) {
          assert(!hasInnerHtml)
          // - We don't use a static import because static imports are hoisted => React's HMR preamble can be executed after user land code => triggering this error:
          //   ```
          //   [22:28:57.885][/test-dev.test.ts][pnpm run dev][Browser Error] Error: @vitejs/plugin-react-swc can't detect preamble. Something is wrong.
          //       at http://localhost:3000/@fs/home/rom/code/docpress/src/renderer/usePageContext.tsx:9:11
          //   ```
          // - We don't use `await` the dynamic import() to avoid waterfall
          contents.push(`import(${JSON.stringify(src)});`)
        } else if (hasInnerHtml) {
          innerHtml = innerHtml.split('\n').filter(Boolean).join('\n')
          contents.push(innerHtml)
        }
      })
      if (contents.length > 0) {
        const nonceAttr = inferNonceAttr(pageContext)
        scriptTag += `<script ${scriptAttrs}${nonceAttr}>\n${contents.join('\n')}\n</script>`
      }
    }
  }

  // We don't need to merge ES5 scripts
  {
    const scriptsES5 = scripts.filter(({ isModule }) => !isModule)
    scriptsES5.forEach(({ outerHtml }) => {
      scriptTag += outerHtml
    })
  }

  return scriptTag
}

function parseScripts(htmlString: string) {
  const scripts: { isModule: boolean; innerHtml: string; outerHtml: string; src: null | string }[] = []
  let match: RegExpExecArray | null
  while ((match = scriptRE.exec(htmlString))) {
    const [outerHtml, openTag, innerHtml] = match
    assert(outerHtml && openTag && innerHtml !== undefined)

    let isModule = false
    {
      const typeMatch = openTag.match(typeRE)
      const type = typeMatch && (typeMatch[1] || typeMatch[2] || typeMatch[3])
      isModule = type === 'module'
    }

    let src: null | string = null
    {
      const srcMatch = openTag.match(srcRE)
      src = (srcMatch && (srcMatch[1] || srcMatch[2] || srcMatch[3])) || ''
    }

    scripts.push({ isModule, src, innerHtml, outerHtml })
  }
  return scripts
}
