export { determineOptimizeDeps }

import type { ResolvedConfig } from 'vite'
import { findPageFiles } from '../../shared/findPageFiles.js'
import { assert, getFilePathAbsolute, isNotNullish, isNpmPackageImport, unique } from '../../utils.js'
import { getVikeConfig } from '../importUserCode/v1-design/getVikeConfig.js'
import { ConfigVpsResolved } from '../../../../shared/ConfigVps.js'

async function determineOptimizeDeps(config: ResolvedConfig, configVps: ConfigVpsResolved, isDev: true) {
  const { entries, include } = await getPageDeps(config, configVps, isDev)

  include.push(...getExtensionsDeps(configVps))

  /* Other Vite plugins may populate optimizeDeps, e.g. Cypress: https://github.com/brillout/vite-plugin-ssr/issues/386
  assert(config.optimizeDeps.entries === undefined)
  */
  config.optimizeDeps.include = [...include, ...normalizeInclude(config.optimizeDeps.include)]
  config.optimizeDeps.entries = [...entries, ...normalizeEntries(config.optimizeDeps.entries)]
}

async function getPageDeps(config: ResolvedConfig, configVps: ConfigVpsResolved, isDev: true) {
  let entries: string[] = []
  let include: string[] = []

  // V1 design
  {
    const { pageConfigsData } = await getVikeConfig(config.root, isDev, configVps.extensions)
    pageConfigsData.forEach((data) => {
      Object.entries(data.configElements).forEach(([_configName, configElement]) => {
        const { codeFilePath, configEnv } = configElement
        if (!codeFilePath) return
        if (configEnv !== 'client-only' && configEnv !== 'server-and-client') return

        if (codeFilePath.startsWith('/')) {
          // Is getFilePathAbsolute() really needed? This contradicts the code below that doesn't need getFilePathAbsolute().
          entries.push(getFilePathAbsolute(codeFilePath, config))
          return
        }

        // getVikeConfig() resolves relative import paths
        assert(!codeFilePath.startsWith('.'))

        // We need to differentiate between npm package imports and path aliases.
        // There are path aliases that cannot be distinguished from npm package names.
        // We recommend users to use the '#' prefix convention for path aliases, see https://vite-plugin-ssr.com/path-aliases#vite and assertResolveAlias()
        if (isNpmPackageImport(codeFilePath)) {
          // isNpmPackageImport() returns false for a path alias like #root/renderer/onRenderClient
          assert(!codeFilePath.startsWith('#'))
          include.push(codeFilePath)
        } else {
          /* Path aliases, e.g.:
           * ```js
           * // /renderer/+config.js
           * import onRenderClient from '#root/renderer/onRenderClient'
           * ```
           * Does Vite resolve the path aliases or is getFilePathAbsolute() needed?
           */
          entries.push(codeFilePath)
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
