export { determineOptimizeDepsEntries }

import type { ResolvedConfig } from 'vite'
import { findPageFiles } from '../../helpers'
import { makeFilePathAbsolute, unique } from '../../utils'
import { getConfigData } from '../importUserCode/v1-design/getConfigData'

async function determineOptimizeDepsEntries(config: ResolvedConfig, isDev: boolean): Promise<string[]> {
  let entries: string[] = []

  // V1 design
  {
    const { pageConfigsData } = await getConfigData(config.root, true, false)
    pageConfigsData.forEach((data) => {
      Object.values(data.configSources).forEach((configSource) => {
        const { codeFilePath2, c_env } = configSource
        if (codeFilePath2 && (c_env === 'client-only' || c_env === 'server-and-client')) {
          entries.push(makeFilePathAbsolute(codeFilePath2, config))
        }
      })
    })
  }

  // V0.4 design
  {
    const pageFiles = await findPageFiles(config, ['.page', '.page.client'], isDev)
    pageFiles.forEach((filePath) => {
      const entry = makeFilePathAbsolute(filePath, config)
      entries.push(entry)
    })
  }

  entries = unique(entries)
  return entries
}
