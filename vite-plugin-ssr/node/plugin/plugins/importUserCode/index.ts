export { importUserCode }

import type { Plugin, ResolvedConfig, HmrContext, ViteDevServer, ModuleNode } from 'vite'
import { normalizePath } from 'vite'
import type { ConfigVpsResolved } from '../../../../shared/ConfigVps.js'
import { getConfigVps } from '../../../shared/getConfigVps.js'
import { getVirtualFileImportCodeFiles } from './v1-design/getVirtualFileImportCodeFiles.js'
import { getVirtualFileImportUserCode } from './getVirtualFileImportUserCode.js'
import {
  assert,
  assertPosixPath,
  getFilePathVite,
  getVirtualFileId,
  isDev1,
  isDev1_onConfigureServer,
  isVirtualFileId,
  resolveVirtualFileId
} from '../../utils.js'
import { isVirtualFileIdImportPageCode } from '../../../shared/virtual-files/virtualFileImportPageCode.js'
import { isVirtualFileIdImportUserCode } from '../../../shared/virtual-files/virtualFileImportUserCode.js'
import { vikeConfigDependencies, reloadVikeConfig, isVikeConfigFile } from './v1-design/getVikeConfig.js'
import pc from '@brillout/picocolors'
import { logConfigInfo, clearLogs } from '../../shared/loggerNotProd.js'

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
      try {
        return handleHotUpdate(ctx, config, configVps)
      } catch (err) {
        // Vite swallows errors thrown by handleHotUpdate()
        console.error(err)
        throw err
      }
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
    const isVikeConfig = isVikeConfigModule(file) || isVikeConfigFile(file)
    if (isVikeConfig) {
      const virtualModules = getVirtualModules(server)
      virtualModules.forEach((mod) => {
        server.moduleGraph.invalidateModule(mod)
      })
      reloadConfig(file, config, configVps, isRemove ? 'removed' : 'created')
    }
  }
}

function handleHotUpdate(ctx: HmrContext, config: ResolvedConfig, configVps: ConfigVpsResolved) {
  const { file, server } = ctx
  assertPosixPath(file)
  vikeConfigDependencies.forEach((f) => assertPosixPath(f))
  const isVikeConfig = isVikeConfigModule(file)

  const isViteModule = ctx.modules.length > 0

  /* Should we show this?
  // - Can be useful for server files that aren't processed by Vite.
  // - Can be annoying for files that obviously aren't processed by Vite.
  if (!isVikeConfig && !isViteModule) {
    logViteAny(
      `${msg} — ${pc.bold('no HMR')}, see https://vite-plugin-ssr.com/on-demand-compiler`,
      'info',
      null,
      true,
      clear,
      config
    )
    return
  }
  //*/

  // HMR can resolve errors => we clear previously shown errors.
  // It can hide an error it shouldn't hide (because the error isn't shown again), but it's ok since users can reload the page and the error will be shown again (Vite transpilation errors are shown again upon a page reload).
  if (!isVikeConfig && isViteModule) {
    clearLogs({ clearErrors: true })
    return
  }

  if (isVikeConfig) {
    assert(!isViteModule)
    reloadConfig(file, config, configVps, 'modified')
    const virtualModules = getVirtualModules(server)
    return virtualModules
  }
}

function isVikeConfigModule(filePathAbsolute: string): boolean {
  return vikeConfigDependencies.has(filePathAbsolute)
}

function reloadConfig(
  filePath: string,
  config: ResolvedConfig,
  configVps: ConfigVpsResolved,
  op: 'modified' | 'created' | 'removed'
) {
  {
    const filePathToShowToUser = pc.dim(getFilePathVite(filePath, config.root, true))
    const msg = `${op} ${filePathToShowToUser}`
    logConfigInfo(msg, 'info')
  }
  reloadVikeConfig(config.root, configVps.extensions)
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
