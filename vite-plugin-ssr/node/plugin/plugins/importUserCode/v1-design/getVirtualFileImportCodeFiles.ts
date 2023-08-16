export { getVirtualFileImportCodeFiles }

import { assert, assertPosixPath } from '../../../utils.js'
import type { PageConfigData } from '../../../../../shared/page-configs/PageConfig.js'
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
  Object.entries(pageConfigData.configElements).forEach(([configName, configElement]) => {
    if (!configElement.codeFilePath) return
    const { configEnv, codeFilePath, codeFileExport } = configElement

    if (configEnv === '_routing-eager' || configEnv === 'config-only') return
    if (configEnv === (isForClientSide ? 'server-only' : 'client-only')) return
    if (configEnv === '_routing-lazy' && isForClientSide && !isClientRouting) return

    assertPosixPath(codeFilePath)
    const fileName = path.posix.basename(codeFilePath)
    const isPlusFile = fileName.startsWith('+')

    const { importVar, importStatement } = generateEagerImport(
      codeFilePath,
      varCounter++,
      isPlusFile ? undefined : codeFileExport
    )
    importStatements.push(importStatement)

    lines.push(`  {`)
    lines.push(`    configName: '${configName}',`)
    lines.push(`    codeFilePath: '${codeFilePath}',`)
    lines.push(`    isPlusFile: ${JSON.stringify(isPlusFile)},`)
    if (isPlusFile) {
      lines.push(`    codeFileExports: ${importVar},`)
    } else {
      lines.push(`    codeFileExportValue: ${importVar}`)
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
