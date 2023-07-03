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
  getFilePathVite,
  getVirtualFileId,
  isDev1,
  isDev1_onConfigureServer,
  isVirtualFileId,
  resolveVirtualFileId
} from '../../utils'
import { isVirtualFileIdImportPageCode } from '../../../shared/virtual-files/virtualFileImportPageCode'
import { isVirtualFileIdImportUserCode } from '../../../shared/virtual-files/virtualFileImportUserCode'
import { vikeConfigDependencies, reloadVikeConfig } from './v1-design/getVikeConfig'
import pc from '@brillout/picocolors'
import { logConfigInfo, clearLogs } from '../../shared/loggerNotProd'

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
    const isVikeConfigModule = isVikeConfigFile(file)
    if (isVikeConfigModule) {
      const virtualModules = getVirtualModules(server)
      virtualModules.forEach((mod) => {
        server.moduleGraph.invalidateModule(mod)
      })
      reloadConfig(file, config, configVps, isRemove ? 'removed' : 'added')
    }
  }
}

function handleHotUpdate(ctx: HmrContext, config: ResolvedConfig, configVps: ConfigVpsResolved) {
  const { file, server } = ctx
  assertPosixPath(file)
  vikeConfigDependencies.forEach((f) => assertPosixPath(f))
  const isVikeConfigModule = isVikeConfigFile(file)

  const isViteConfigModule = ctx.modules.length > 0

  /* Should we show this?
  // - Can be useful for server files that aren't processed by Vite.
  // - Can be annoying for files that obviously aren't processed by Vite.
  if (!isVikeConfigModule && !isViteConfigModule) {
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
  if (!isVikeConfigModule && isViteConfigModule) {
    clearLogs({ clearErrors: true })
    return
  }

  if (isVikeConfigModule) {
    assert(!isViteConfigModule)
    reloadConfig(file, config, configVps, 'modified')
    const virtualModules = getVirtualModules(server)
    return virtualModules
  }
}

function isVikeConfigFile(filePathAbsolute: string): boolean {
  return vikeConfigDependencies.has(filePathAbsolute)
}

function reloadConfig(
  filePath: string,
  config: ResolvedConfig,
  configVps: ConfigVpsResolved,
  op: 'modified' | 'added' | 'removed'
) {
  {
    const filePathToShowToUser = pc.dim(getFilePathVite(filePath, config.root, true))
    const msg = `Config file ${op} ${filePathToShowToUser}`
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
