export { serializeConfigValue }
export { serializeConfigValueImported }

// This file is never loaded on the client-side but we save it under the vike/shared/ directory in order to collocate it with:
//   - vike/shared/page-configs/serialize/parsePageConfigs.ts
//   - vike/shared/page-configs/serialize/parseConfigValuesImported.ts
// Both parsePageConfigs() parseConfigValuesImported() and are loaded on the client-side and server-side
import { assertIsNotProductionRuntime } from '../../../utils/assertIsNotProductionRuntime.js'
assertIsNotProductionRuntime()

import path from 'path'
import { assert, assertPosixPath } from '../../utils.js'
import { ConfigValueSource } from '../PageConfig.js'
import { ConfigValueSerialized } from './PageConfigSerialized.js'
import { generateEagerImport } from '../../../node/plugin/plugins/importUserCode/generateEagerImport.js'

function serializeConfigValue(lines: string[], configName: string, configValueSerialized: ConfigValueSerialized) {
  let whitespace = '      '
  lines.push(`${whitespace}['${configName}']: {`)
  whitespace += '  '

  Object.entries(configValueSerialized).forEach(([key, val]) => {
    const valSerialized = key === 'definedAt' ? JSON.stringify(val) : val
    lines.push(`${whitespace}  ${key}: ${valSerialized},`)
  })

  whitespace = whitespace.slice(2)
  lines.push(`${whitespace}},`)
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

  const { valueIsImportedAtRuntime, definedAt } = configValueSource
  assert(valueIsImportedAtRuntime)
  const { filePathAbsoluteVite, fileExportName } = definedAt

  assertPosixPath(filePathAbsoluteVite)
  const fileName = path.posix.basename(filePathAbsoluteVite)
  const isValueFile = fileName.startsWith('+')

  if (isValueFile) assert(fileExportName === undefined)
  const { importName, importStatement } = generateEagerImport(
    filePathAbsoluteVite,
    varCounterContainer.varCounter++,
    fileExportName
  )
  importStatements.push(importStatement)

  const lines: string[] = []
  lines.push(`  {`)
  lines.push(`    configName: '${configName}',`)
  lines.push(`    importPath: '${filePathAbsoluteVite}',`)
  lines.push(`    isValueFile: ${JSON.stringify(isValueFile)},`)
  if (isValueFile) {
    lines.push(`    exportValues: ${importName},`)
  } else {
    lines.push(`    exportValue: ${importName},`)
    assert(fileExportName)
    lines.push(`    exportName: ${JSON.stringify(fileExportName)},`)
  }
  lines.push(`  },`)
  return lines
}
