export { pluginReloadServer }

import type { Plugin, RunnableDevEnvironment } from 'vite'
import pc from '@brillout/picocolors'
import { onPlusMiddlewareChange } from '../../../../server/runtime/plusMiddlewareChange.js'
import { assertInfo } from '../../../../utils/assert.js'
import { isRunnableDevEnvironment } from '../../../../utils/isRunnableDevEnvironment.js'
import '../../assertEnvVite.js'

// A +server.js that applies `globalContext.middlewares` holds the list it got: in development, it's re-evaluated when the +middleware change, upon the next request.
// (A +server.js that uses vike(app) looks the +middleware up upon each request.)
function pluginReloadServer(serverFilePath: string): Plugin {
  let removeListener: (() => void) | undefined
  return {
    name: 'vike:pluginUniversalDeploy:reloadServer',
    apply: 'serve',
    configureServer(server) {
      removeListener = onPlusMiddlewareChange(() => {
        const reloaded = Object.values(server.environments).filter(
          (environment) =>
            isRunnableDevEnvironment(environment) && invalidateModuleAndImporters(environment, serverFilePath),
        )
        if (reloaded.length > 0)
          assertInfo(false, `${pc.cyan('+middleware')} changed, reloading ${pc.cyan('+server')}...`, {
            onlyOnce: false,
          })
      })
    },
    // Runs when the Vite server closes (such as upon a restart because of a change of the Vite config)
    closeBundle() {
      removeListener?.()
    },
  }
}

// The modules that import +server.js (such as the entry of universal-deploy) hold its exports => they're evaluated again as well
function invalidateModuleAndImporters(environment: RunnableDevEnvironment, filePath: string): boolean {
  const { evaluatedModules } = environment.runner
  const modules = Array.from(evaluatedModules.idToModuleMap.values()).filter(
    (mod) => mod.file === filePath && mod.evaluated,
  )
  const visited = new Set<string>()
  const stack = [...modules]
  while (stack.length > 0) {
    const mod = stack.pop()!
    if (visited.has(mod.id)) continue
    visited.add(mod.id)
    evaluatedModules.invalidateModule(mod)
    for (const importerId of mod.importers) {
      const importer = evaluatedModules.getModuleById(importerId)
      if (importer) stack.push(importer)
    }
  }
  return modules.length > 0
}
