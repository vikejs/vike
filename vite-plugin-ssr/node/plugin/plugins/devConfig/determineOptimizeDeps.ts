export { determineOptimizeDeps }

import type { ResolvedConfig } from 'vite'
import { findPageFiles } from '../../shared/findPageFiles'
import { assert, getFilePathAbsolute, isNotNullish, unique } from '../../utils'
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

  // V1 design
  {
    const { pageConfigsData } = await getConfigData(config.root, true, (await getConfigVps(config)).extensions)
    pageConfigsData.forEach((data) => {
      Object.entries(data.configElements).forEach(([_configName, configElement]) => {
        const { codeFilePath, configEnv } = configElement
        if (codeFilePath && (configEnv === 'client-only' || configEnv === 'server-and-client')) {
          let filePath: string
          if (!codeFilePath.startsWith('/')) {
            /* For path aliases, e.g.:
             * ```
             * // /renderer/+config.js
             * import onRenderClient from '#root/renderer/onRenderClient'
             * // ...
             * ```
             * Does Vite resolve the path aliases or getFilePathAbsolute() needed?
             */
            filePath = codeFilePath
          } else {
            // Is getFilePathAbsolute() really needed?
            filePath = getFilePathAbsolute(codeFilePath, config)
          }
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
  return { entries }
}
