export { serializeConfigValues }

import { assertIsNotProductionRuntime } from '../../../utils/assertIsNotProductionRuntime.js'
import { assert, assertUsage, getPropAccessNotation } from '../../../node/plugin/utils.js'
import type {
  ConfigEnvInternal,
  ConfigValue,
  ConfigValueSource,
  DefinedAtData,
  DefinedAtFile,
  PageConfigBuildTime,
  PageConfigGlobalBuildTime
} from '../PageConfig.js'
import type { ValueSerialized } from './PageConfigSerialized.js'
import { addImportStatement } from '../../../node/plugin/plugins/importUserCode/addImportStatement.js'
import { parsePointerImportData } from '../../../node/plugin/plugins/importUserCode/v1-design/getVikeConfig/transformFileImports.js'
import { getConfigValueFilePathToShowToUser } from '../helpers.js'
import { stringify } from '@brillout/json-serializer/stringify'
import pc from '@brillout/picocolors'
const REPLACE_ME_BEFORE = '__VIKE__REPLACE_ME_BEFORE__'
const REPLACE_ME_AFTER = '__VIKE__REPLACE_ME_AFTER__'

// This file is never loaded on the client-side but we save it under the vike/shared/ directory in order to collocate it with parsePageConfigs()
// - vike/shared/page-configs/serialize/parsePageConfigs.ts
// - parsePageConfigs() is loaded on both the client- and server-side.
assertIsNotProductionRuntime()

function serializeConfigValues(
  pageConfig: PageConfigBuildTime | (PageConfigGlobalBuildTime & { configValuesComputed?: undefined }),
  importStatements: string[],
  isEnvMatch: (configEnv: ConfigEnvInternal) => boolean,
  { isEager }: { isEager: boolean },
  tabspace: string
): string[] {
  const lines: string[] = []
  tabspace += '  '

  Object.entries(pageConfig.configValuesComputed ?? {}).forEach(([configName, configValuesComputed]) => {
    if (!isEnvMatch(configValuesComputed.configEnv)) return
    // Is there a use case for overriding computed values? If yes, then configValeSources has higher precedence
    if (pageConfig.configValueSources[configName]) return
    const valueData = serializeWithJson(configValuesComputed.value, configName, null, importStatements)
    const configValueBase = {
      type: 'computed',
      definedAtData: null
    } as const
    serializeConfigValue(configValueBase, valueData, configName, lines, tabspace)
  })

  Object.entries(pageConfig.configValueSources).forEach(([configName, sources]) => {
    const configDef = pageConfig.configDefinitions[configName]
    assert(configDef)
    if (isEager !== !!configDef.eager) return
    if (!configDef.cumulative) {
      const configValueSource = sources[0]
      assert(configValueSource)
      assert(sources.slice(1).every((s) => s.isOverriden === true))
      if (!isEnvMatch(configValueSource.configEnv)) return
      const { valueData, definedAtFile } = serializeConfigValueSource(configValueSource, configName, importStatements)
      const configValueBase = {
        type: 'standard',
        definedAtData: definedAtFile
      } as const
      serializeConfigValue(configValueBase, valueData, configName, lines, tabspace)
    } else {
      const valueDataList: ValueData[] = []
      const definedAtData: DefinedAtFile[] = []
      sources
        .filter((s) => !s.isOverriden)
        .forEach((configValueSource) => {
          if (!isEnvMatch(configValueSource.configEnv)) return
          const { valueData, definedAtFile } = serializeConfigValueSource(
            configValueSource,
            configName,
            importStatements
          )
          valueDataList.push(valueData)
          definedAtData.push(definedAtFile)
        })
      if (valueDataList.length === 0) return
      const configValueBase = {
        type: 'cumulative',
        definedAtData
      } as const
      serializeConfigValue(configValueBase, valueDataList, configName, lines, tabspace)
    }
  })

  return lines
}

function serializeConfigValueSource(
  configValueSource: ConfigValueSource,
  configName: string,
  importStatements: string[]
) {
  assert(configValueSource.isOverriden === false)
  let valueData: ValueData
  if ('value' in configValueSource) {
    valueData = serializeWithJson(
      configValueSource.value,
      configName,
      configValueSource.definedAtFilePath,
      importStatements
    )
  } else {
    valueData = serializeWithImport(configValueSource, importStatements)
  }
  const definedAtFile: DefinedAtFile = {
    filePathToShowToUser: configValueSource.definedAtFilePath.filePathToShowToUser,
    fileExportPathToShowToUser: configValueSource.definedAtFilePath.fileExportPathToShowToUser
  }
  return { valueData, definedAtFile }
}

type ValueData = {
  type: ValueSerialized['type']
  valueAsJsCode: string
}
function serializeConfigValue(
  configValueBase: Omit<ConfigValue, 'value'>,
  valueData: ValueData | ValueData[],
  configName: string,
  lines: string[],
  tabspace: string
) {
  lineAdd(`[${JSON.stringify(configName)}]: {`)
  {
    tab()
    lineAdd(`type: "${configValueBase.type}",`)
    lineAdd(`definedAtData: ${JSON.stringify(configValueBase.definedAtData)},`)
    lineAdd(`valueSerialized:`)
    if (!Array.isArray(valueData)) {
      serializeValueData(valueData)
    } else {
      lineAppend(' [')
      valueData.forEach(serializeValueData)
      lineAppend(` ],`)
    }
    untab()
  }
  lineAdd('},')

  return

  function serializeValueData(valueData: ValueData) {
    lineAppend(` {`)
    tab()
    lineAdd(`type: "${valueData.type}",`)
    const valueProp: ValueProp = valueData.type !== 'plus-file' ? 'value' : 'exportValues'
    lineAdd(`${valueProp}: ${valueData.valueAsJsCode},`)
    untab()
    lineAdd(`},`)
  }
  type ValueProp = Exclude<KeysOfUnion<ValueSerialized>, 'type'>
  // https://stackoverflow.com/questions/49401866/all-possible-keys-of-an-union-type/49402091#49402091
  type KeysOfUnion<T> = T extends T ? keyof T : never

  function lineAppend(str: string) {
    const i = lines.length - 1
    lines[i] = lines[i] += str
  }
  function lineAdd(str: string) {
    lines.push(`${tabspace}${str}`)
  }
  function tab() {
    tabspace += '  '
  }
  function untab() {
    tabspace = tabspace.slice(2)
  }
}

function serializeWithImport(configValueSource: ConfigValueSource, importStatements: string[]): ValueData {
  assert(!configValueSource.valueIsFilePath)

  const { valueIsImportedAtRuntime, valueIsDefinedByPlusFile, definedAtFilePath } = configValueSource
  assert(valueIsImportedAtRuntime)
  const { filePathAbsoluteVite, fileExportName } = definedAtFilePath

  if (valueIsDefinedByPlusFile) assert(fileExportName === undefined)
  const { importName } = addImportStatement(importStatements, filePathAbsoluteVite, fileExportName || '*')

  return {
    type: valueIsDefinedByPlusFile ? 'plus-file' : 'pointer-import',
    valueAsJsCode: importName
  }
}

function serializeWithJson(
  value: unknown,
  configName: string,
  definedAtData: DefinedAtData,
  importStatements: string[]
): ValueData {
  const valueAsJsCode = valueToJson(value, configName, definedAtData, importStatements)
  return {
    type: 'js-serialized',
    valueAsJsCode
  }
}
function valueToJson(
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
      // Replace import strings with import variables.
      // - We don't need this anymore and could remove it.
      //   - We temporarily needed it for nested document configs (`config.document.{title,description,favicon}`), but we finally decided to go for flat document configs instead (`config.{title,description,favicon}`).
      //   - https://github.com/vikejs/vike-react/pull/113
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
