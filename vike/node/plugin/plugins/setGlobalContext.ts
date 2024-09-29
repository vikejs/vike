export { setGlobalContext }

import type { Plugin } from 'vite'
import {
  setGlobalContext_isDev,
  setGlobalContext_viteDevServer,
  setGlobalContext_viteConfig
} from '../../runtime/globalContext.js'
import { assertFilePathAbsoluteFilesystem, getOutDirs, isDev3 } from '../utils.js'

function setGlobalContext(): Plugin {
  return {
    name: 'vike:setGlobalContext',
    enforce: 'pre',
    configureServer: {
      order: 'pre',
      handler(viteDevServer) {
        setGlobalContext_viteDevServer(viteDevServer)
      }
    },
    config: {
      handler(_, env) {
        const isDev = isDev3(env)
        setGlobalContext_isDev(isDev)
      }
    },
    configResolved(config) {
      const { outDirRoot } = getOutDirs(config)
      assertFilePathAbsoluteFilesystem(outDirRoot) // Needed for loadImportBuild(outDir) of @brillout/vite-plugin-server-entry
      setGlobalContext_viteConfig(config, outDirRoot)
    }
  }
}
