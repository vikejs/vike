export { mergeScriptTags }

import { assert } from '../../utils'

const scriptRE = /(<script\b(?:\s[^>]*>|>))(.*?)<\/script>/gims
const srcRE = /\bsrc\s*=\s*(?:"([^"]+)"|'([^']+)'|([^\s'">]+))/im
const typeRE = /\btype\s*=\s*(?:"([^"]+)"|'([^']+)'|([^\s'">]+))/im

function mergeScriptTags(scriptTagsHtml: string): string {
  let scriptsES5 = ''
  const scriptsModuleContent: string[] = []

  const scripts = parseScripts(scriptTagsHtml)
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

  let scriptTag = ''
  if (scriptsModuleContent.length > 0) {
    scriptTag += `<script type="module" async>\n${scriptsModuleContent.join('\n')}\n</script>`
  }
  if (scriptsES5) {
    scriptTag += scriptsES5
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
