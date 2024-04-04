export { determineOptimizeDeps }

import type { ResolvedConfig } from 'vite'
import { findPageFiles } from '../../shared/findPageFiles.js'
import { assert, assertIsNpmPackageImport, createDebugger, unique } from '../../utils.js'
import { getVikeConfig } from '../importUserCode/v1-design/getVikeConfig.js'
import { getConfigValueSourcesNotOverriden } from '../../shared/getConfigValueSourcesNotOverriden.js'
import { analyzeClientEntries } from '../buildConfig.js'
import type { PageConfigBuildTime } from '../../../../shared/page-configs/PageConfig.js'
import {
  virtualFileIdImportUserCodeClientCR,
  virtualFileIdImportUserCodeClientSR
} from '../../../shared/virtual-files/virtualFileImportUserCode.js'
import { getFilePathResolved } from '../../shared/getFilePath.js'

const debug = createDebugger('vike:optimizeDeps')

async function determineOptimizeDeps(config: ResolvedConfig, isDev: true) {
  const { pageConfigs } = await getVikeConfig(config, isDev)

  const { entries, include } = await getPageDeps(config, pageConfigs, isDev)
  {
    // This actually doesn't work: Vite's dep optimizer doesn't seem to be able to crawl virtual files.
    //  - Should we make it work? E.g. by creating a temporary file at node_modules/.vike/virtualFiles.js
    //  - Or should we remove it? And make sure getPageDeps() also works for aliased import paths
    //    - If we do, then we need to adjust include/entries (maybe by making include === entries -> will Vite complain?)
    const entriesVirtualFiles = getVirtualFiles(config, pageConfigs)
    entries.push(...entriesVirtualFiles)
  }

  /* Other Vite plugins may populate optimizeDeps, e.g. Cypress: https://github.com/vikejs/vike/issues/386
  assert(config.optimizeDeps.entries === undefined)
  */
  config.optimizeDeps.include = [...include, ...normalizeInclude(config.optimizeDeps.include)]
  config.optimizeDeps.entries = [...entries, ...normalizeEntries(config.optimizeDeps.entries)]

  if (debug.isActivated)
    debug('config.optimizeDeps', {
      'config.optimizeDeps.entries': config.optimizeDeps.entries,
      'config.optimizeDeps.include': config.optimizeDeps.include
    })
}

async function getPageDeps(config: ResolvedConfig, pageConfigs: PageConfigBuildTime[], isDev: true) {
  let entries: string[] = []
  let include: string[] = []

  const addEntry = (e: string) => {
    assert(e)
    entries.push(e)
  }
  const addInclude = (e: string) => {
    assert(e)
    assertIsNpmPackageImport(e)
    include.push(e)
  }

  // V1 design
  {
    pageConfigs.forEach((pageConfig) => {
      getConfigValueSourcesNotOverriden(pageConfig).forEach((configValueSource) => {
        if (!configValueSource.valueIsImportedAtRuntime) return
        const { definedAt, configEnv } = configValueSource

        if (!configEnv.client) return

        if (definedAt.filePathAbsoluteUserRootDir !== null) {
          const { filePathAbsoluteFilesystem } = definedAt
          // Surprisingly Vite expects entries to be absolute paths
          addEntry(filePathAbsoluteFilesystem)
        } else {
          // Adding definedAt.filePathAbsoluteFilesystem doesn't work for npm packages, I guess because of Vite's config.server.fs.allow
          const { importPathAbsolute } = definedAt
          // Shouldn't be a path alias, as path aliases would need to be added to config.optimizeDeps.entries instead of config.optimizeDeps.include
          addInclude(importPathAbsolute)
        }
      })
    })
  }

  // V0.4 design
  {
    const pageFiles = await findPageFiles(config, ['.page', '.page.client'], isDev)
    const userRootDir = config.root
    pageFiles.forEach((filePathAbsoluteUserRootDir) => {
      const entry = getFilePathResolved({ filePathAbsoluteUserRootDir, userRootDir })
      const { filePathAbsoluteFilesystem } = entry
      addEntry(filePathAbsoluteFilesystem)
    })
  }

  entries = unique(entries)
  include = unique(include)
  return { entries, include }
}

function getVirtualFiles(config: ResolvedConfig, pageConfigs: PageConfigBuildTime[]): string[] {
  const { hasClientRouting, hasServerRouting, clientEntries } = analyzeClientEntries(pageConfigs, config)

  const entriesVirtualFiles = Object.values(clientEntries)
  if (hasClientRouting) entriesVirtualFiles.push(virtualFileIdImportUserCodeClientCR)
  if (hasServerRouting) entriesVirtualFiles.push(virtualFileIdImportUserCodeClientSR)

  return entriesVirtualFiles
}

function normalizeEntries(entries: string | string[] | undefined) {
  if (Array.isArray(entries)) return entries
  if (typeof entries === 'string') return [entries]
  if (entries === undefined) return []
  assert(false)
}
function normalizeInclude(include: string[] | undefined) {
  if (Array.isArray(include)) return include
  if (include === undefined) return []
  assert(false)
}
