export { determineOptimizeDeps }

import type { ResolvedConfig } from 'vite'
import { findPageFiles } from '../../shared/findPageFiles.js'
import { assert, assertIsNpmPackageImport, createDebugger, isArray, unique } from '../../utils.js'
import { getVikeConfig } from '../importUserCode/v1-design/getVikeConfig.js'
import { analyzeClientEntries } from '../buildConfig/assetsManifestPlugin.js'
import type { PageConfigBuildTime } from '../../../../shared/page-configs/PageConfig.js'
import {
  virtualFileIdImportUserCodeClientCR,
  virtualFileIdImportUserCodeClientSR
} from '../../../shared/virtual-files/virtualFileImportUserCode.js'
import { getFilePathResolved } from '../../shared/getFilePath.js'

const debug = createDebugger('vike:optimizeDeps')

async function determineOptimizeDeps(config: ResolvedConfig) {
  const { pageConfigs } = await getVikeConfig(config)

  const { entries, include } = await getPageDeps(config, pageConfigs)
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

async function getPageDeps(config: ResolvedConfig, pageConfigs: PageConfigBuildTime[]) {
  let entries: string[] = []
  let include: string[] = []

  const addEntry = (e: string) => {
    assert(e)
    entries.push(e)
  }
  const addInclude = (e: string) => {
    assert(e)
    // Shouldn't be a path alias, as path aliases would need to be added to config.optimizeDeps.entries instead of config.optimizeDeps.include
    assertIsNpmPackageImport(e)
    include.push(e)
  }

  // V1 design
  {
    pageConfigs.forEach((pageConfig) => {
      Object.values(pageConfig.configValueSources).forEach((sources) => {
        sources
          .filter((c) => !c.isOverriden)
          .forEach((configValueSource) => {
            if (!configValueSource.valueIsLoadedWithImport && !configValueSource.valueIsFilePath) return
            const { definedAtFilePath, configEnv } = configValueSource

            if (!configEnv.client) return

            if (definedAtFilePath.filePathAbsoluteUserRootDir !== null) {
              // Vite expects entries to be filesystem absolute paths (surprisingly so).
              addEntry(definedAtFilePath.filePathAbsoluteFilesystem)
            } else {
              // Adding definedAtFilePath.filePathAbsoluteFilesystem doesn't work for npm packages, I guess because of Vite's config.server.fs.allow
              addInclude(definedAtFilePath.importPathAbsolute)
            }
          })
      })
    })
  }

  // V0.4 design
  {
    const pageFiles = await findPageFiles(config, ['.page', '.page.client'], true)
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
  if (isArray(entries)) return entries
  if (typeof entries === 'string') return [entries]
  if (entries === undefined) return []
  assert(false)
}
function normalizeInclude(include: string[] | undefined) {
  if (isArray(include)) return include
  if (include === undefined) return []
  assert(false)
}
