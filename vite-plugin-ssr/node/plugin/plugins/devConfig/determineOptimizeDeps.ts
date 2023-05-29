export { determineOptimizeDeps }

import type { ResolvedConfig } from 'vite'
import { findPageFiles } from '../../shared/findPageFiles'
import { assert, getFilePathAbsolute, isNotNullish, unique } from '../../utils'
import { getConfigData } from '../importUserCode/v1-design/getConfigData'
import { getConfigVps } from '../../../shared/getConfigVps'
import { ConfigVpsResolved } from '../../../../shared/ConfigVps'

async function determineOptimizeDeps(config: ResolvedConfig, configVps: ConfigVpsResolved) {
  addExtensionsToOptimizeDeps(config, configVps)
  addOptimizeDeps(
    config,
    await determineEntries(
      config,
      // This function is also called when running `$ vite preview` but that's okay
      true
    )
  )
}

function addExtensionsToOptimizeDeps(config: ResolvedConfig, configVps: ConfigVpsResolved) {
  config.optimizeDeps.include = config.optimizeDeps.include ?? []
  config.optimizeDeps.include.push(
    ...configVps.extensions
      .map(({ pageConfigsDistFiles }) => pageConfigsDistFiles)
      .flat()
      .filter(isNotNullish)
      .filter(({ importPath }) => !importPath.endsWith('.css'))
      .map(({ importPath }) => importPath)
  )
  /* Doesn't work since `pageConfigsSrcDir` is a directory. We could make it work by using find-glob.
  config.optimizeDeps.include.push(
    ...configVps.extensions
      .map(({ pageConfigsSrcDir }) => pageConfigsSrcDir)
      .flat()
      .filter(isNotNullish)
  )
  */
}

function addOptimizeDeps(config: ResolvedConfig, entries: string[]) {
  const total = []

  const val = config.optimizeDeps.entries
  if (typeof val === 'string') {
    total.push(val)
  } else if (Array.isArray(val)) {
    total.push(...val)
  } else {
    assert(val === undefined)
  }

  total.push(...entries)

  config.optimizeDeps.entries = total
}

async function determineEntries(config: ResolvedConfig, isDev: true): Promise<string[]> {
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
  return entries
}
