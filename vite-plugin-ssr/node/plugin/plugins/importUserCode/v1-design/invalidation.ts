export { getInvalidator }
export { invalidateVirtualFilesImportPageCode }

import type { ViteDevServer } from 'vite'
import { isVirtualFileIdImportPageCode } from '../../../../shared/virtual-files/virtualFileImportPageCode'
import { assert } from '../../../utils'

// We cannot use the getInvalidator() trick for the code importers.
// Instead we manually invalidate all code importers whenever the main virtual files is invalidated (which happens for every relevant change as per the glob `import.meta.glob('/**/+*')` below)
function invalidateVirtualFilesImportPageCode(server: ViteDevServer) {
  Array.from(server.moduleGraph.urlToModuleMap.keys())
    .filter((modUrl) => isVirtualFileIdImportPageCode(modUrl))
    .forEach((modUrl) => {
      server.moduleGraph.onFileChange(modUrl)
    })
}

function getInvalidator(isDev: boolean) {
  assert(isDev)
  // The crawled files are never loaded (the export `invalidator` isn't used), the only effect of this glob is to invalidate the virtual module.
  // We agressively invalidate the virual files because they are cheap and fast to re-create.
  // The export `invalidator` isn't really used: it's only used to assert that we don't glob any unexpected file.
  return "export const invalidator = import.meta.glob('/**/+*');"
}
