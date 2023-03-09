export { getInvalidatorGlob }
export { invalidateCodeImporters }

import type { ViteDevServer } from 'vite'
import { assert } from '../../../utils'

// We cannot use the getInvalidatorGlob() trick for the code importers.
// Instead we manually invalidate all code importers whenever the main virtual files is invalidated (which happens for every relevant change as per the glob `import.meta.glob('/**/+*')` below)
function invalidateCodeImporters(server: ViteDevServer) {
  Array.from(server.moduleGraph.urlToModuleMap.keys())
    .filter((modUrl) => modUrl.includes('virtual:vite-plugin-ssr:importPageCode:'))
    .forEach((modUrl) => {
      server.moduleGraph.onFileChange(modUrl)
    })
}

function getInvalidatorGlob(isDev: boolean) {
  assert(isDev)
  // The crawled files are never loaded (the plusFilesGlob export isn't used), the only effect of this glob is to invalidate the virtual module.
  // We agressively invalidate the virual files because they are cheap and fast to re-create.
  // The plusFilesGlob export isn't really used: it's only used to assert that we don't glob any unexpected file.
  return "export const plusFilesGlob = import.meta.glob('/**/+*');"
}
