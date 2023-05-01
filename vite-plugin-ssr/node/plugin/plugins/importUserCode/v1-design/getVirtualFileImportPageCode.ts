export { getVirtualFileImportPageCode }

import { assert, assertPosixPath } from '../../../utils'
import type { PlusConfigData } from '../../../../../shared/page-configs/PlusConfig'
import { generateEagerImport } from '../generateEagerImport'
import {
  getVirtualFileIdImportPageCode,
  isVirtualFileIdImportPageCode
} from '../../../../shared/virtual-files/virtualFileImportPageCode'
import { getConfigData } from './getConfigData'
import { extractAssetsAddQuery } from '../../../../shared/extractAssetsQuery'
import { debug } from './debug'
import type { ConfigVpsResolved } from '../../../../../shared/ConfigVps'
import path from 'path'

async function getVirtualFileImportPageCode(
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
  const { plusConfigsData } = await getConfigData(userRootDir, isDev, false, configVps.extensions)
  assert(plusConfigsData)
  const plusConfigData = plusConfigsData.find((plusConfigData) => plusConfigData.pageId === pageId)
  assert(plusConfigData)
  const code = generateSourceCodeOfLoadCodeFileVirtualFile(
    plusConfigData,
    isForClientSide,
    pageId,
    configVps.includeAssetsImportedByServer,
    isDev
  )
  debug(id, isForClientSide ? 'CLIENT-SIDE' : 'SERVER-SIDE', code)
  return code
}

function generateSourceCodeOfLoadCodeFileVirtualFile(
  plusConfigData: PlusConfigData,
  isForClientSide: boolean,
  pageId: string,
  includeAssetsImportedByServer: boolean,
  isDev: boolean
): string {
  const lines: string[] = []
  const importStatements: string[] = []
  lines.push('export default [')
  let varCounter = 0
  Object.entries(plusConfigData.configElements).forEach(([configName, configElement]) => {
    if (!configElement.plusValueFilePath) return
    const { configEnv, plusValueFilePath, plusValueFileExport } = configElement
    if (configEnv === '_routing-env' || configEnv === 'config-only') return
    if (configEnv === (isForClientSide ? 'server-only' : 'client-only')) return
    assertPosixPath(plusValueFilePath)
    const fileName = path.posix.basename(plusValueFilePath)
    const isPlusFile = fileName.startsWith('+')

    const { importVar, importStatement } = generateEagerImport(
      plusValueFilePath,
      varCounter++,
      isPlusFile ? undefined : plusValueFileExport
    )
    importStatements.push(importStatement)

    lines.push(`  {`)
    lines.push(`    configName: '${configName}',`)
    lines.push(`    importFile: '${plusValueFilePath}',`)
    lines.push(`    isPlusFile: ${JSON.stringify(isPlusFile)},`)
    if (isPlusFile) {
      lines.push(`    importFileExports: ${importVar},`)
    } else {
      lines.push(`    importValue: ${importVar}`)
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
