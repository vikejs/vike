export { determineOptimizeDeps }

import type { ResolvedConfig } from 'vite'
import { findPageFiles } from '../../shared/findPageFiles.js'
import { assert, getFilePathAbsolute, isNotNullish, isNpmPackageImport, unique } from '../../utils.js'
import { getVikeConfig } from '../importUserCode/v1-design/getVikeConfig.js'
import { ConfigVpsResolved } from '../../../../shared/ConfigVps.js'
import { getConfigValueSourcesRelevant } from '../../shared/getConfigValueSource.js'
import { analyzeClientEntries } from '../buildConfig.js'
import type { PageConfigBuildTime } from '../../../../shared/page-configs/PageConfig.js'
import {
  virtualFileIdImportUserCodeClientCR,
  virtualFileIdImportUserCodeClientSR
} from '../../../shared/virtual-files/virtualFileImportUserCode.js'

async function determineOptimizeDeps(config: ResolvedConfig, configVps: ConfigVpsResolved, isDev: true) {
  const { pageConfigs } = await getVikeConfig(config.root, isDev, configVps.extensions)

  const { entries, include } = await getPageDeps(config, pageConfigs, isDev)
  {
    // This actually doesn't work: Vite's dep optimizer doesn't seem to be able to crawl virtual files.
    //  - Should we make it work? E.g. by creating a temporary file at node_modules/.vite-plugin-ssr/virtualFiles.js
    //  - Or should we remove it? And make sure getPageDeps() also works for aliased import paths
    //    - If we do, then we need to adjust include/entries (maybe by making include === entries -> will Vite complain?)
    const entriesVirtualFiles = getVirtualFiles(config, pageConfigs)
    entries.push(...entriesVirtualFiles)
  }

  include.push(...getExtensionsDeps(configVps))

  /* Other Vite plugins may populate optimizeDeps, e.g. Cypress: https://github.com/brillout/vite-plugin-ssr/issues/386
  assert(config.optimizeDeps.entries === undefined)
  */
  config.optimizeDeps.include = [...include, ...normalizeInclude(config.optimizeDeps.include)]
  config.optimizeDeps.entries = [...entries, ...normalizeEntries(config.optimizeDeps.entries)]

  // console.log('config.optimizeDeps', config.optimizeDeps)
}

async function getPageDeps(config: ResolvedConfig, pageConfigs: PageConfigBuildTime[], isDev: true) {
  let entries: string[] = []
  let include: string[] = []

  // V1 design
  {
    pageConfigs.forEach((pageConfig) => {
      const configValueSourcesRelevant = getConfigValueSourcesRelevant(pageConfig)
      configValueSourcesRelevant.forEach((configValueSource) => {
        const { valueIsImportedAtRuntime, configEnv, definedAtInfo } = configValueSource
        if (!valueIsImportedAtRuntime) return
        const { filePath } = definedAtInfo
        assert(filePath)

        if (configEnv !== 'client-only' && configEnv !== 'server-and-client') return

        if (filePath.startsWith('/')) {
          // Is getFilePathAbsolute() really needed? This contradicts the code below that doesn't need getFilePathAbsolute().
          entries.push(getFilePathAbsolute(filePath, config))
          return
        }

        // getVikeConfig() resolves relative import paths
        assert(!filePath.startsWith('.'))

        // We need to differentiate between npm package imports and path aliases.
        // There are path aliases that cannot be distinguished from npm package names.
        // We recommend users to use the '#' prefix convention for path aliases, see https://vike.dev/path-aliases#vite and assertResolveAlias()
        if (isNpmPackageImport(filePath)) {
          // isNpmPackageImport() returns false for a path alias like #root/renderer/onRenderClient
          assert(!filePath.startsWith('#'))
          include.push(filePath)
        } else {
          /* Path aliases, e.g.:
           * ```js
           * // /renderer/+config.js
           * import onRenderClient from '#root/renderer/onRenderClient'
           * ```
           * Does Vite resolve the path aliases or is getFilePathAbsolute() needed?
           */
          entries.push(filePath)
        }
      })
    })
  }

  // V0.4 design
  {
    const pageFiles = await findPageFiles(config, ['.page', '.page.client'], isDev)
    pageFiles.forEach((filePath) => {
      const entry = getFilePathAbsolute(filePath, config)
      entries.push(entry)
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

function getExtensionsDeps(configVps: ConfigVpsResolved): string[] {
  return [
    /* Doesn't work since `pageConfigsSrcDir` is a directory. We could make it work by using find-glob.
    ...configVps.extensions
      .map(({ pageConfigsSrcDir }) => pageConfigsSrcDir)
      .flat()
      .filter(isNotNullish),
    //*/
    ...configVps.extensions
      .map(({ pageConfigsDistFiles }) => pageConfigsDistFiles)
      .flat()
      .filter(isNotNullish)
      .filter(({ importPath }) => !importPath.endsWith('.css'))
      .map(({ importPath }) => importPath)
  ]
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
