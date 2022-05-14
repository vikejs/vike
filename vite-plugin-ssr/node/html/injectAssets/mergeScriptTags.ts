export { mergeScriptTags }

import { assert } from '../../utils'

const scriptRE = /(<script\b(?:\s[^>]*>|>))(.*?)<\/script>/gims
const srcRE = /\bsrc\s*=\s*(?:"([^"]+)"|'([^']+)'|([^\s'">]+))/im
const typeRE = /\btype\s*=\s*(?:"([^"]+)"|'([^']+)'|([^\s'">]+))/im

function mergeScriptTags(scriptTagsHtml: string): string {
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
          contents.push(`import ${JSON.stringify(src)};`)
        } else if (hasInnerHtml) {
          innerHtml = innerHtml.split('\n').filter(Boolean).join('\n')
          contents.push(innerHtml)
        }
      })
      if (contents.length > 0) {
        scriptTag += `<script type="module" async>\n${contents.join('\n')}\n</script>`
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
