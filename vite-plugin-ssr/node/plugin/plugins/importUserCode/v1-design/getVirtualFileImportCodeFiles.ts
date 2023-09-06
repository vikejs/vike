export { getVirtualFileImportCodeFiles }
export { skipConfigValue }

import { assert, assertPosixPath } from '../../../utils.js'
import type { ConfigEnvInternal, PageConfigData } from '../../../../../shared/page-configs/PageConfig.js'
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
import { getConfigValueSourcesRelevant } from '../../../../shared/getConfigValueSource.js'

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
  const { pageConfigsData } = await getVikeConfig(userRootDir, isDev, configVps.extensions, true)
  assert(pageConfigsData)
  const pageConfigData = pageConfigsData.find((pageConfigData) => pageConfigData.pageId === pageId)
  assert(pageConfigData)
  const code = generateSourceCodeOfLoadCodeFileVirtualFile(
    pageConfigData,
    isForClientSide,
    pageId,
    configVps.includeAssetsImportedByServer,
    isDev
  )
  debug(id, isForClientSide ? 'CLIENT-SIDE' : 'SERVER-SIDE', code)
  return code
}

function generateSourceCodeOfLoadCodeFileVirtualFile(
  pageConfigData: PageConfigData,
  isForClientSide: boolean,
  pageId: string,
  includeAssetsImportedByServer: boolean,
  isDev: boolean
): string {
  const isClientRouting = getConfigValue(pageConfigData, 'clientRouting', 'boolean') ?? false
  const lines: string[] = []
  const importStatements: string[] = []
  lines.push('export default [')
  let varCounter = 0
  getConfigValueSourcesRelevant(pageConfigData).forEach((configValueSource) => {
    const {
      isCodeEntry,
      configName,
      configEnv,
      definedAt: { filePath, fileExportPath }
    } = configValueSource
    const fileExportName = fileExportPath[0]
    assert(fileExportName)

    if (!isCodeEntry) return
    if (skipConfigValue(configEnv, isForClientSide, isClientRouting)) return

    assertPosixPath(filePath)
    const fileName = path.posix.basename(filePath)
    const isPlusFile = fileName.startsWith('+')

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
