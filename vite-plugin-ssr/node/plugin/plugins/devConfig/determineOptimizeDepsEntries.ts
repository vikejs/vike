export { determineOptimizeDepsEntries }

import type { ResolvedConfig } from 'vite'
import { findPageFiles } from '../../shared/findPageFiles'
import { makeVitePathAbsolute, unique } from '../../utils'
import { getConfigData } from '../importUserCode/v1-design/getConfigData'
import { getConfigVps } from '../../../shared/getConfigVps'

async function determineOptimizeDepsEntries(config: ResolvedConfig, isDev: boolean): Promise<string[]> {
  let entries: string[] = []

  // V1 design
  {
    const { pageConfigsData } = await getConfigData(config.root, true, false, (await getConfigVps(config)).extensions)
    pageConfigsData.forEach((data) => {
      Object.values(data.configSources).forEach((configSource) => {
        const { codeFilePath2, env } = configSource
        if (codeFilePath2 && (env === 'client-only' || env === 'server-and-client')) {
          entries.push(makeVitePathAbsolute(codeFilePath2, config))
        }
      })
    })
  }

  // V0.4 design
  {
    const pageFiles = await findPageFiles(config, ['.page', '.page.client'], isDev)
    pageFiles.forEach((filePath) => {
      const entry = makeVitePathAbsolute(filePath, config)
      entries.push(entry)
    })
  }

  entries = unique(entries)
  return entries
}
