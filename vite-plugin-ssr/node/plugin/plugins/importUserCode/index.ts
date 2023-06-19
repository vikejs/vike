export { importUserCode }

import type { Plugin, ResolvedConfig, HmrContext, ViteDevServer, ModuleNode } from 'vite'
import { normalizePath } from 'vite'
import type { ConfigVpsResolved } from '../../../../shared/ConfigVps'
import { getConfigVps } from '../../../shared/getConfigVps'
import { getVirtualFileImportCodeFiles } from './v1-design/getVirtualFileImportCodeFiles'
import { getVirtualFileImportUserCode } from './getVirtualFileImportUserCode'
import {
  assert,
  assertPosixPath,
  getVirtualFileId,
  isDev1,
  isDev1_onConfigureServer,
  isVirtualFileId,
  resolveVirtualFileId
} from '../../utils'
import { isVirtualFileIdImportPageCode } from '../../../shared/virtual-files/virtualFileImportPageCode'
import { isVirtualFileIdImportUserCode } from '../../../shared/virtual-files/virtualFileImportUserCode'
import { getConfigData_dependenciesInvisibleToVite, getConfigName, reloadConfigData } from './v1-design/getConfigData'
import path from 'path'
import pc from '@brillout/picocolors'
import { logConfigInfo, clearWithVite } from '../../shared/loggerNotProd'

function importUserCode(): Plugin {
  let config: ResolvedConfig
  let configVps: ConfigVpsResolved
  return {
    name: 'vite-plugin-ssr:importUserCode',
    config() {
      return {
        experimental: {
          // TODO/v1-release: remove
          importGlobRestoreExtension: true
        }
      }
    },
    async configResolved(config_) {
      configVps = await getConfigVps(config_)
      config = config_
    },
    resolveId(id) {
      if (isVirtualFileId(id)) {
        return resolveVirtualFileId(id)
      }
    },
    handleHotUpdate(ctx) {
      return handleHotUpdate(ctx, config, configVps)
    },
    async load(id, options) {
      const isDev = isDev1()

      if (!isVirtualFileId(id)) return undefined
      id = getVirtualFileId(id)

      if (isVirtualFileIdImportPageCode(id)) {
        const code = await getVirtualFileImportCodeFiles(id, config.root, isDev, configVps)
        return code
      }

      if (isVirtualFileIdImportUserCode(id)) {
        const code = await getVirtualFileImportUserCode(id, options, configVps, config, isDev)
        return code
      }
    },
    configureServer(server) {
      isDev1_onConfigureServer()
      handleFileAddRemove(server, config, configVps)
    }
  }
}

function handleFileAddRemove(server: ViteDevServer, config: ResolvedConfig, configVps: ConfigVpsResolved) {
  server.watcher.prependListener('add', (f) => listener(f, false))
  server.watcher.prependListener('unlink', (f) => listener(f, true))
  return
  function listener(file: string, isRemove: boolean) {
    file = normalizePath(file)
    const configName = getConfigName(file)
    if (configName) {
      const virtualModules = getVirtualModules(server)
      virtualModules.forEach((mod) => {
        server.moduleGraph.invalidateModule(mod)
      })
      reload(file, config, configVps, isRemove ? 'removed' : 'added')
    }
  }
}

function handleHotUpdate(ctx: HmrContext, config: ResolvedConfig, configVps: ConfigVpsResolved) {
  const { file, server } = ctx
  assertPosixPath(file)
  getConfigData_dependenciesInvisibleToVite.forEach((f) => assertPosixPath(f))
  const isVikeConfig = getConfigData_dependenciesInvisibleToVite.has(file)

  const isViteModule = ctx.modules.length > 0

  if (!isVikeConfig) {
    /*/
    const clear = true
    /*/
    const clear = false
    //*/
    if (!isViteModule) {
      /* Should we show this?
      logViteAny(
        `${msg} — ${pc.bold('no HMR')}, see https://vite-plugin-ssr.com/on-demand-compiler`,
        'info',
        null,
        true,
        clear,
        config
      )
      */
    } else {
      if (clear) {
        clearWithVite(config)
      }
    }
    return
  } else {
    assert(!isViteModule)
    clearWithVite(config)
    reload(file, config, configVps, 'change')
    const virtualModules = getVirtualModules(server)
    return virtualModules
  }
}

function reload(
  filePath: string,
  config: ResolvedConfig,
  configVps: ConfigVpsResolved,
  op: 'change' | 'added' | 'removed'
) {
  {
    const filePathToShowToUser = pc.dim(makeRelativeToUserRootDir(filePath, config.root))
    const msg = `File ${op}: ${filePathToShowToUser}`
    logConfigInfo(msg, 'info')
  }
  reloadConfigData(config.root, configVps.extensions)
}

function getVirtualModules(server: ViteDevServer): ModuleNode[] {
  const virtualModules = Array.from(server.moduleGraph.urlToModuleMap.keys())
    .filter((url) => isVirtualFileIdImportPageCode(url) || isVirtualFileIdImportUserCode(url))
    .map((url) => {
      const mod = server.moduleGraph.urlToModuleMap.get(url)
      assert(mod)
      return mod
    })
  return virtualModules
}

function makeRelativeToUserRootDir(filePathAbsolute: string, userRootDir: string): string {
  assertPosixPath(filePathAbsolute)
  assertPosixPath(userRootDir)
  const filePathRelativeToUserRootDir = path.posix.relative(userRootDir, filePathAbsolute)
  return filePathRelativeToUserRootDir
}
