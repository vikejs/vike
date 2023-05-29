export { determineOptimizeDeps }

import type { ResolvedConfig } from 'vite'
import { findPageFiles } from '../../shared/findPageFiles'
import { assert, getFilePathAbsolute, isNotNullish, isNpmPackageName, unique } from '../../utils'
import { getConfigData } from '../importUserCode/v1-design/getConfigData'
import { getConfigVps } from '../../../shared/getConfigVps'
import { ConfigVpsResolved } from '../../../../shared/ConfigVps'

async function determineOptimizeDeps(config: ResolvedConfig, configVps: ConfigVpsResolved, isDev: true) {
  const { entries } = await determineEntries(config, isDev)
  const includes = getExtensionsInclude(configVps)

  /* Other Vite plugins may populate optimizeDeps, e.g. Cypress: https://github.com/brillout/vite-plugin-ssr/issues/386
  assert(config.optimizeDeps.entries === undefined)
  */
  config.optimizeDeps.include = [...includes, ...normalizeInclude(config.optimizeDeps.include)]
  config.optimizeDeps.entries = [...entries, ...normalizEntries(config.optimizeDeps.entries)]
}

function getExtensionsInclude(configVps: ConfigVpsResolved): string[] {
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

function normalizEntries(entries: string | string[] | undefined) {
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

async function determineEntries(config: ResolvedConfig, isDev: true) {
  let entries: string[] = []
  let include: string[] = []

  // V1 design
  {
    const { pageConfigsData } = await getConfigData(config.root, true, (await getConfigVps(config)).extensions)
    pageConfigsData.forEach((data) => {
      Object.entries(data.configElements).forEach(([_configName, configElement]) => {
        const { codeFilePath, configEnv } = configElement
        if (!codeFilePath) return
        if (!(configEnv === 'client-only' || configEnv === 'server-and-client')) return

        let filePath: string
        if (codeFilePath.startsWith('/')) {
          // Is getFilePathAbsolute() really needed?
          entries.push(getFilePathAbsolute(codeFilePath, config))
          return
        }

        if (isNpmPackageName(codeFilePath)) {
          // isNpmPackageName() returns false for a path aliase like `$root/...`.
          // Are there path alises that cannot be distinguished from npm package names?
          assert(!codeFilePath.includes('#'))
          entries.push(codeFilePath)
        } else {
          /* For path aliases, e.g.:
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
  return { entries, include }
}
