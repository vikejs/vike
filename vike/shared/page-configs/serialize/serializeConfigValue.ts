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

  const { valueIsImportedAtRuntime, definedAtInfo } = configValueSource
  assert(valueIsImportedAtRuntime)
  const { filePathRelativeToUserRootDir, importPathAbsolute, exportName } = definedAtInfo
  const importPath = filePathRelativeToUserRootDir ?? importPathAbsolute

  assertPosixPath(importPath)
  const fileName = path.posix.basename(importPath)
  const isValueFile = fileName.startsWith('+')

  if (isValueFile) assert(exportName === undefined)
  const { importName, importStatement } = generateEagerImport(importPath, varCounterContainer.varCounter++, exportName)
  importStatements.push(importStatement)

  const lines: string[] = []
  lines.push(`  {`)
  lines.push(`    configName: '${configName}',`)
  lines.push(`    importPath: '${importPath}',`)
  lines.push(`    isValueFile: ${JSON.stringify(isValueFile)},`)
  if (isValueFile) {
    lines.push(`    exportValues: ${importName},`)
  } else {
    lines.push(`    exportValue: ${importName},`)
    assert(exportName)
    lines.push(`    exportName: ${JSON.stringify(exportName)},`)
  }
  lines.push(`  },`)
  return lines
}
