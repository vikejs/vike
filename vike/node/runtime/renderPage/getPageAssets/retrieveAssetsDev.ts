export { retrieveAssetsDev }

import { assert, styleFileRE } from '../../utils.js'
import type { ModuleNode, ViteDevServer } from 'vite'
import type { ClientDependency } from '../../../../shared/getPageFiles/analyzePageClientSide/ClientDependency.js'

async function retrieveAssetsDev(clientDependencies: ClientDependency[], viteDevServer: ViteDevServer) {
  const assetUrls = new Set<string>()
  await Promise.all(
    clientDependencies.map(async ({ id }) => {
      if (id.startsWith('@@vike')) return // vike doesn't have any CSS
      assert(id)
      const { moduleGraph } = viteDevServer
      const [_, graphId] = await moduleGraph.resolveUrl(id)
      assert(graphId, { id })
      const mod = moduleGraph.getModuleById(graphId)
      if (!mod) {
        /* Not sure when the assertion fails. So let's just remove it for now.
         *  - https://github.com/vikejs/vike/issues/391
        // `moduleGraph` is missing `.page.client.js` files on the very first render
        assert(id.includes('.page.client.'), { id })
        */
        return
      }
      assert(mod, { id })
      collectCss(mod, assetUrls, new Set())
    })
  )
  return Array.from(assetUrls)
}

// Collect the CSS to be injected to the HTML to avoid FLOUC
//  - We only collect the root import: https://github.com/vikejs/vike/issues/400
function collectCss(mod: ModuleNode, styleUrls: Set<string>, visitedModules: Set<string>, importer?: ModuleNode): void {
  assert(mod)
  if (!mod.url) return
  if (visitedModules.has(mod.url)) return
  visitedModules.add(mod.url)
  if (isStyle(mod) && (!importer || !isStyle(importer))) {
    if (mod.url.startsWith('/')) {
      styleUrls.add(mod.url)
    } else if (mod.url.startsWith('\0')) {
      // Virtual modules
      //  - https://vitejs.dev/guide/api-plugin.html#virtual-modules-convention
      //    - I believe some Vite plugins don't respect the \0 virtual module convention. What should we do then?
      //  - https://github.com/vikejs/vike/issues/1327
      //  - https://github.com/vikejs/vike/commit/3f7b9916dddc84e29e2c20d2b0df7211b6f1acbd
      //  - https://github.com/vikejs/vike/issues/479#issuecomment-1870043943
      styleUrls.add(`/@id/__x00__${mod.url.substring(1)}`)
    } else {
      // Is this useful? Maybe for virtual modules that don't respect the \0 virtual module convention?
      styleUrls.add(`/@id/${mod.url}`)
    }
  }
  mod.importedModules.forEach((dep) => {
    collectCss(dep, styleUrls, visitedModules, mod)
  })
}

function isStyle(mod: ModuleNode) {
  return (
    // CSS-in-JS libraries such as [wyw-in-js](https://github.com/vikejs/vike/issues/2039)
    mod.type === 'css' ||
    // .css, .less, ...
    styleFileRE.test(mod.url) ||
    // CSS of .vue files
    (mod.id && /\?vue&type=style/.test(mod.id))
  )
}
