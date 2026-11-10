export { invalidateVikeVirtualFiles }
export { getVikeVirtualFiles }

import type { ViteDevServer, ModuleNode } from 'vite'
import { assert } from '../../../../utils/assert.js'
import { parseVirtualFileId } from '../../../../shared-server-node/virtualFileId.js'
import { isRunnableDevEnvironment } from '../../../../utils/isRunnableDevEnvironment.js'
import '../../assertEnvVite.js'

function invalidateVikeVirtualFiles(server: ViteDevServer) {
  const vikeVirtualFiles = getVikeVirtualFiles(server)
  vikeVirtualFiles.forEach((mod) => {
    server.moduleGraph.invalidateModule(mod)
  })
  // - `server.moduleGraph` only covers the `client` and `ssr` environments, while additional environments (e.g. `rsc`) also load Vike's virtual files
  Object.values(server.environments).forEach((environment) => {
    environment.moduleGraph.idToModuleMap.forEach((mod, id) => {
      if (parseVirtualFileId(id)) environment.moduleGraph.invalidateModule(mod)
    })
    if (!isRunnableDevEnvironment(environment)) return
    const { evaluatedModules } = environment.runner
    evaluatedModules.idToModuleMap.forEach((mod, id) => {
      if (parseVirtualFileId(id)) evaluatedModules.invalidateModule(mod)
    })
  })
}

function getVikeVirtualFiles(server: ViteDevServer): ModuleNode[] {
  const vikeVirtualFiles = Array.from(server.moduleGraph.urlToModuleMap.keys())
    .filter((url) => parseVirtualFileId(url))
    .map((url) => {
      const mod = server.moduleGraph.urlToModuleMap.get(url)
      assert(mod)
      return mod
    })
  return vikeVirtualFiles
}
