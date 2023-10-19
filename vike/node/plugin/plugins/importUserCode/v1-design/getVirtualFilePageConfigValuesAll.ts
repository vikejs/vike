export { getVirtualFilePageConfigValuesAll }
export { serializeConfigValueImported }

import { assert, assertPosixPath } from '../../../utils.js'
import type { ConfigValueSource, PageConfigBuildTime } from '../../../../../shared/page-configs/PageConfig.js'
import { generateEagerImport } from '../generateEagerImport.js'
import {
  getVirtualFileIdPageConfigValuesAll,
  isVirtualFileIdPageConfigValuesAll
} from '../../../../shared/virtual-files/virtualFilePageConfigValuesAll.js'
import { getVikeConfig } from './getVikeConfig.js'
import { extractAssetsAddQuery } from '../../../../shared/extractAssetsQuery.js'
import { debug } from './debug.js'
import type { ConfigVikeResolved } from '../../../../../shared/ConfigVike.js'
import path from 'path'
import { getConfigValue } from '../../../../../shared/page-configs/utils.js'
import { getConfigValueSourcesRelevant } from '../../../shared/getConfigValueSourcesRelevant.js'
import { isConfigEnvMatch } from './isConfigEnvMatch.js'

async function getVirtualFilePageConfigValuesAll(
  id: string,
  userRootDir: string,
  isDev: boolean,
  configVike: ConfigVikeResolved
): Promise<string> {
  const result = isVirtualFileIdPageConfigValuesAll(id)
  assert(result)
  /* This assertion fails when using includeAssetsImportedByServer
  {
    const isForClientSide = !config.build.ssr
    assert(result.isForClientSide === isForClientSide)
  }
  */
  const { pageId, isForClientSide } = result
  const { pageConfigs } = await getVikeConfig(userRootDir, isDev, configVike.extensions, true)
  const pageConfig = pageConfigs.find((pageConfig) => pageConfig.pageId === pageId)
  assert(pageConfig)
  const code = getLoadConfigValuesAll(
    pageConfig,
    isForClientSide,
    pageId,
    configVike.includeAssetsImportedByServer,
    isDev
  )
  debug(id, isForClientSide ? 'CLIENT-SIDE' : 'SERVER-SIDE', code)
  return code
}

function getLoadConfigValuesAll(
  pageConfig: PageConfigBuildTime,
  isForClientSide: boolean,
  pageId: string,
  includeAssetsImportedByServer: boolean,
  isDev: boolean
): string {
  const configValue = getConfigValue(pageConfig, 'clientRouting', 'boolean')
  const isClientRouting = configValue?.value ?? false
  const lines: string[] = []
  const importStatements: string[] = []
  lines.push('export default [')
  const varCounterContainer = { varCounter: 0 }
  getConfigValueSourcesRelevant(pageConfig).forEach((configValueSource) => {
    const { valueIsImportedAtRuntime, configEnv, configName } = configValueSource

    if (!valueIsImportedAtRuntime) return
    if (configValueSource.valueIsFilePath) return
    if (!isConfigEnvMatch(configEnv, isForClientSide, isClientRouting)) return

    const whitespace = '  '
    lines.push(
      ...serializeConfigValueImported(configValueSource, configName, whitespace, varCounterContainer, importStatements)
    )
  })
  lines.push('];')
  if (includeAssetsImportedByServer && isForClientSide && !isDev) {
    lines.push(`import '${extractAssetsAddQuery(getVirtualFileIdPageConfigValuesAll(pageId, false))}'`)
  }
  const code = [...importStatements, ...lines].join('\n')
  return code
}

function serializeConfigValueImported(
  configValueSource: ConfigValueSource,
  configName: string,
  whitespace: string,
  varCounterContainer: { varCounter: number },
  importStatements: string[]
): string[] {
  assert(!configValueSource.valueIsFilePath)
  assert(whitespace.replaceAll(' ', '').length === 0)

  const { valueIsImportedAtRuntime, definedAtInfo } = configValueSource
  assert(valueIsImportedAtRuntime)
  const { filePathRelativeToUserRootDir, importPathAbsolute, exportName } = definedAtInfo
  const importPath = filePathRelativeToUserRootDir ?? importPathAbsolute

  assertPosixPath(importPath)
  const fileName = path.posix.basename(importPath)
  const isValueFile = fileName.startsWith('+')

  if (isValueFile) assert(exportName === undefined)
  const { importName, importStatement } = generateEagerImport(
    importPath,
    varCounterContainer.varCounter++,
    exportName
  )
  importStatements.push(importStatement)

  const lines: string[] = []
  lines.push(`  {`)
  lines.push(`    configName: '${configName}',`)
  lines.push(`    importPath: '${importPath}',`)
  lines.push(`    isValueFile: ${JSON.stringify(isValueFile)},`)
  if (isValueFile) {
    lines.push(`    importFileExports: ${importName},`)
  } else {
    lines.push(`    importFileExportValue: ${importName},`)
    assert(exportName)
    lines.push(`    exportName: ${JSON.stringify(exportName)},`)
  }
  lines.push(`  },`)
  return lines
}
