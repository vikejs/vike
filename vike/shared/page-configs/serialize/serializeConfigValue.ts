export { serializeConfigValueImported }
export { getConfigValuesSerialized }
export { assertConfigValueIsSerializable }

// This file is never loaded on the client-side but we save it under the vike/shared/ directory in order to collocate it with parsePageConfigs()
// - vike/shared/page-configs/serialize/parsePageConfigs.ts
// - parsePageConfigs() is loaded on both the client- and server-side.
import { assertIsNotProductionRuntime } from '../../../utils/assertIsNotProductionRuntime.js'
assertIsNotProductionRuntime()

import { assert, assertUsage, getPropAccessNotation } from '../../../node/plugin/utils.js'
import type { ConfigEnvInternal, ConfigValueSource, DefinedAtData, PageConfigBuildTime } from '../PageConfig.js'
import type { ConfigValueSerialized } from './PageConfigSerialized.js'
import { addImportStatement } from '../../../node/plugin/plugins/importUserCode/addImportStatement.js'
import { getConfigValueSourcesNotOverriden } from '../../../node/plugin/shared/getConfigValueSourcesNotOverriden.js'
import { parsePointerImportData } from '../../../node/plugin/plugins/importUserCode/v1-design/getVikeConfig/transformFileImports.js'
import { getConfigValueFilePathToShowToUser } from '../helpers.js'
import { stringify } from '@brillout/json-serializer/stringify'
import pc from '@brillout/picocolors'
const REPLACE_ME_BEFORE = '__VIKE__REPLACE_ME_BEFORE__'
const REPLACE_ME_AFTER = '__VIKE__REPLACE_ME_AFTER__'

function getConfigValuesSerialized(
  pageConfig: PageConfigBuildTime,
  importStatements: string[],
  isEnvMatch: (configEnv: ConfigEnvInternal, configValueSource?: ConfigValueSource) => boolean
): string {
  const lines: string[] = []
  Object.entries(pageConfig.configValuesComputed).forEach(([configName, configValuesComputed]) => {
    const { configEnv } = configValuesComputed

    if (!isEnvMatch(configEnv)) return
    // configValeSources has higher precedence
    if (pageConfig.configValueSources[configName]) return

    const configValue = pageConfig.configValues[configName]
    assert(configValue)
    const { value, ...common } = configValue
    assert(value === configValuesComputed.value)
    const valueSerialized = getValueSerialized(value, configName, configValue.definedAtData, importStatements)
    const configValueSerialized = { valueSerialized, ...common }
    serializeConfigValue(lines, configName, configValueSerialized)
  })
  // We iterate over pageConfig.configValueSources instead of pageConfig.configValues in order to access configEnv
  // Shouldn't we create a new map pageConfig.configEnv instead?
  const configNameVisited = new Set<string>()
  getConfigValueSourcesNotOverriden(pageConfig).forEach((configValueSource) => {
    const { configName, configEnv } = configValueSource
    if (configNameVisited.has(configName)) return
    configNameVisited.add(configName)

    const configValue = pageConfig.configValues[configName]

    if (!configValue) return
    if (!isEnvMatch(configEnv, configValueSource)) {
      return
    }

    const { value, ...common } = configValue
    const valueSerialized = getValueSerialized(value, configName, configValue.definedAtData, importStatements)
    const configValueSerialized = { valueSerialized, ...common }
    serializeConfigValue(lines, configName, configValueSerialized)
  })
  const code = lines.join('\n')
  return code
}

function assertConfigValueIsSerializable(value: unknown, configName: string, definedAtData: DefinedAtData) {
  // Contains asserts
  getValueSerialized(value, configName, definedAtData, [])
}

function getValueSerialized(
  value: unknown,
  configName: string,
  definedAtData: DefinedAtData,
  importStatements: string[]
): string {
  const valueName = `config${getPropAccessNotation(configName)}`

  let configValueSerialized: string
  try {
    configValueSerialized = stringify(value, {
      valueName,
      forbidReactElements: true,
      replacer(_, value) {
        if (typeof value === 'string') {
          const importData = parsePointerImportData(value)
          if (importData) {
            const { importName } = addImportStatement(importStatements, importData.importPath, importData.exportName)
            const replacement = [REPLACE_ME_BEFORE, importName, REPLACE_ME_AFTER].join('')
            return { replacement }
          }
        }
      }
    })
  } catch (err) {
    logJsonSerializeError(err, configName, definedAtData)
    assert(false)
  }

  configValueSerialized = configValueSerialized.replaceAll(`"${REPLACE_ME_BEFORE}`, '')
  configValueSerialized = configValueSerialized.replaceAll(`${REPLACE_ME_AFTER}"`, '')
  assert(!configValueSerialized.includes(REPLACE_ME_BEFORE))
  assert(!configValueSerialized.includes(REPLACE_ME_AFTER))

  return configValueSerialized
}

function logJsonSerializeError(err: unknown, configName: string, definedAtData: DefinedAtData) {
  /*
  // import { isJsonSerializerError } from '@brillout/json-serializer/stringify'
  let serializationErrMsg = ''
  if (isJsonSerializerError(err)) {
    serializationErrMsg = err.messageCore
  } else {
    // When a property getter throws an error
    console.error('Serialization error:')
    console.error(err)
    serializationErrMsg = 'see serialization error printed above'
  }
  //*/
  const configValueFilePathToShowToUser = getConfigValueFilePathToShowToUser(definedAtData)
  assert(configValueFilePathToShowToUser)
  assertUsage(
    false,
    `${pc.cyan(
      configName
    )} defined by ${configValueFilePathToShowToUser} must be defined over a so-called "pointer import", see https://vike.dev/config#pointer-imports`
  )
}
function serializeConfigValue(lines: string[], configName: string, configValueSerialized: ConfigValueSerialized) {
  let whitespace = '      '
  lines.push(`${whitespace}['${configName}']: {`)
  whitespace += '  '

  Object.entries(configValueSerialized).forEach(([key, val]) => {
    const valSerialized = key === 'valueSerialized' ? val : JSON.stringify(val)
    lines.push(`${whitespace}  ${key}: ${valSerialized},`)
  })

  whitespace = whitespace.slice(2)
  lines.push(`${whitespace}},`)
}

function serializeConfigValueImported(
  configValueSource: ConfigValueSource,
  configName: string,
  whitespace: string,
  importStatements: string[]
): string[] {
  assert(!configValueSource.valueIsFilePath)
  assert(whitespace.replaceAll(' ', '').length === 0)

  const { valueIsImportedAtRuntime, valueIsDefinedByValueFile, definedAtFilePath } = configValueSource
  assert(valueIsImportedAtRuntime)
  const { filePathAbsoluteVite, fileExportName } = definedAtFilePath

  if (valueIsDefinedByValueFile) assert(fileExportName === undefined)
  const { importName } = addImportStatement(importStatements, filePathAbsoluteVite, fileExportName || '*')

  const lines: string[] = []
  lines.push(`  {`)
  lines.push(`    configName: '${configName}',`)
  lines.push(`    importPath: '${filePathAbsoluteVite}',`)
  lines.push(`    isValueFile: ${JSON.stringify(valueIsDefinedByValueFile)},`)
  if (valueIsDefinedByValueFile) {
    lines.push(`    exportValues: ${importName},`)
  } else {
    lines.push(`    exportValue: ${importName},`)
    assert(fileExportName)
    lines.push(`    exportName: ${JSON.stringify(fileExportName)},`)
  }
  lines.push(`  },`)
  return lines
}
