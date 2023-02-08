export { loadPageCode }

import { assert, assertDefaultExport, objectAssign } from '../utils'
import type { PageConfig, PageConfigLoaded } from './PageConfig'

async function loadPageCode(pageConfig: PageConfig): Promise<PageConfigLoaded> {
  const configValues: Record<string, unknown> = {}

  if ('configValues' in pageConfig) {
    return pageConfig as PageConfigLoaded
  }

  const codeFiles = await pageConfig.loadCodeFiles()
  codeFiles.forEach(({ configName, codeFilePath3, codeFileExports }) => {
    assertDefaultExport(codeFileExports, codeFilePath3)
    assert(!(configName in configValues))
    configValues[configName] = codeFileExports.default
  })

  await Promise.all(
    Object.entries(pageConfig.configSources).map(async ([configName, configSource]) => {
      if (configSource.codeFilePath2) return
      assert(!(configName in configValues))
      configValues[configName] = configSource.configValue
    })
  )

  objectAssign(pageConfig, { configValues })

  return pageConfig
}
