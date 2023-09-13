export { getVirtualFileImportCodeFiles }
export { skipConfigValue }

import { assert, assertPosixPath } from '../../../utils.js'
import type { ConfigEnvInternal, PageConfigBuildTime } from '../../../../../shared/page-configs/PageConfig.js'
import { generateEagerImport } from '../generateEagerImport.js'
import {
  getVirtualFileIdImportPageCode,
  isVirtualFileIdImportPageCode
} from '../../../../shared/virtual-files/virtualFileImportPageCode.js'
import { getVikeConfig } from './getVikeConfig.js'
import { extractAssetsAddQuery } from '../../../../shared/extractAssetsQuery.js'
import { debug } from './debug.js'
import type { ConfigVpsResolved } from '../../../../../shared/ConfigVps.js'
import path from 'path'
import { getConfigValue } from '../../../../../shared/page-configs/utils.js'
import { getConfigValueSourcesRelevant } from '../../../shared/getConfigValueSource.js'

async function getVirtualFileImportCodeFiles(
  id: string,
  userRootDir: string,
  isDev: boolean,
  configVps: ConfigVpsResolved
): Promise<string> {
  const result = isVirtualFileIdImportPageCode(id)
  assert(result)
  /* This assertion fails when using includeAssetsImportedByServer
  {
    const isForClientSide = !config.build.ssr
    assert(result.isForClientSide === isForClientSide)
  }
  */
  const { pageId, isForClientSide } = result
  const { pageConfigs: pageConfigsData } = await getVikeConfig(userRootDir, isDev, configVps.extensions, true)
  assert(pageConfigsData)
  const pageConfigs = pageConfigsData.find((pageConfig) => pageConfig.pageId === pageId)
  assert(pageConfigs)
  const code = generateSourceCodeOfLoadCodeFileVirtualFile(
    pageConfigs,
    isForClientSide,
    pageId,
    configVps.includeAssetsImportedByServer,
    isDev
  )
  debug(id, isForClientSide ? 'CLIENT-SIDE' : 'SERVER-SIDE', code)
  return code
}

function generateSourceCodeOfLoadCodeFileVirtualFile(
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
  let varCounter = 0
  getConfigValueSourcesRelevant(pageConfig).forEach((configValueSource) => {
    const { isCodeEntry, configName, configEnv, definedAtInfo } = configValueSource

    if (!isCodeEntry) return
    if (configValueSource.valueIsFilePath) return
    if (skipConfigValue(configEnv, isForClientSide, isClientRouting)) return
    const { filePath, fileExportPath } = definedAtInfo

    assertPosixPath(filePath)
    const fileName = path.posix.basename(filePath)
    const isPlusFile = fileName.startsWith('+')

    const fileExportName = fileExportPath[0]
    assert(!configValueSource.valueIsFilePath)
    assert(fileExportName)

    const { importVar, importStatement } = generateEagerImport(
      filePath,
      varCounter++,
      isPlusFile ? undefined : fileExportName
    )
    importStatements.push(importStatement)

    lines.push(`  {`)
    lines.push(`    configName: '${configName}',`)
    lines.push(`    codeFilePath: '${filePath}',`)
    lines.push(`    isPlusFile: ${JSON.stringify(isPlusFile)},`)
    if (isPlusFile) {
      lines.push(`    codeFileExports: ${importVar},`)
    } else {
      lines.push(`    codeFileExportValue: ${importVar},`)
      assert(fileExportName)
      lines.push(`    codeFileExportName: ${JSON.stringify(fileExportName)},`)
    }
    lines.push(`  },`)
  })
  lines.push('];')
  if (includeAssetsImportedByServer && isForClientSide && !isDev) {
    lines.push(`import '${extractAssetsAddQuery(getVirtualFileIdImportPageCode(pageId, false))}'`)
  }
  const code = [...importStatements, ...lines].join('\n')
  return code
}

function skipConfigValue(configEnv: ConfigEnvInternal, isForClientSide: boolean, isClientRouting: boolean) {
  if (configEnv === '_routing-eager' || configEnv === 'config-only') return true
  if (configEnv === (isForClientSide ? 'server-only' : 'client-only')) return true
  if (configEnv === '_routing-lazy' && isForClientSide && !isClientRouting) return true
  return false
}
