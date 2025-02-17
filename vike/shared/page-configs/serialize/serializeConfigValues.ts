export { serializeConfigValues }
export { getConfigValuesBase }
export { isJsonValue }
export type { FilesEnv }

import { assertIsNotProductionRuntime } from '../../../utils/assertSetup.js'
import { assert, assertPosixPath, assertUsage, deepEqual, getPropAccessNotation } from '../../../node/plugin/utils.js'
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
import { parsePointerImportData } from '../../../node/plugin/plugins/importUserCode/v1-design/getVikeConfig/transformPointerImports.js'
import { getConfigValueFilePathToShowToUser } from '../helpers.js'
import { stringify } from '@brillout/json-serializer/stringify'
import pc from '@brillout/picocolors'
const stringifyOptions = { forbidReactElements: true as const }
const REPLACE_ME_BEFORE = '__VIKE__REPLACE_ME_BEFORE__'
const REPLACE_ME_AFTER = '__VIKE__REPLACE_ME_AFTER__'

// This file is never loaded on the client-side but we save it under the vike/shared/ directory in order to collocate it with parsePageConfigs()
// - vike/shared/page-configs/serialize/parsePageConfigs.ts
// - parsePageConfigs() is loaded on both the client- and server-side.
assertIsNotProductionRuntime()

function serializeConfigValues(
  pageConfig: PageConfigBuildTime | PageConfigGlobalBuildTime,
  importStatements: string[],
  filesEnv: FilesEnv,
  isEnvMatch: (configEnv: ConfigEnvInternal) => boolean,
  tabspace: string,
  isEager: boolean | null
): string[] {
  const lines: string[] = []
  tabspace += '  '

  getConfigValuesBase(pageConfig, isEnvMatch, isEager).forEach((entry) => {
    if (entry.configValueBase.type === 'computed') {
      assert('value' in entry) // Help TS
      const { configValueBase, value, configName, configEnv } = entry
      const valueData = getValueSerializedWithJson(
        value,
        configName,
        configValueBase.definedAtData,
        importStatements,
        filesEnv,
        configEnv
      )
      serializeConfigValue(configValueBase, valueData, configName, lines, tabspace)
    }
    if (entry.configValueBase.type === 'standard') {
      assert('sourceRelevant' in entry) // Help TS
      const { configValueBase, sourceRelevant, configName } = entry
      const valueData = getValueSerializedFromSource(sourceRelevant, configName, importStatements, filesEnv)
      serializeConfigValue(configValueBase, valueData, configName, lines, tabspace)
    }
    if (entry.configValueBase.type === 'cumulative') {
      assert('sourcesRelevant' in entry) // Help TS
      const { configValueBase, sourcesRelevant, configName } = entry
      const valueDataList: ValueData[] = []
      sourcesRelevant.forEach((source) => {
        const valueData = getValueSerializedFromSource(source, configName, importStatements, filesEnv)
        valueDataList.push(valueData)
      })
      serializeConfigValue(configValueBase, valueDataList, configName, lines, tabspace)
    }
  })

  return lines
}

function getValueSerializedFromSource(
  configValueSource: ConfigValueSource,
  configName: string,
  importStatements: string[],
  filesEnv: FilesEnv
) {
  assert(configValueSource.isOverriden === false)
  let valueData: ValueData
  if ('value' in configValueSource && !configValueSource.valueIsLoadedWithImport) {
    valueData = getValueSerializedWithJson(
      configValueSource.value,
      configName,
      configValueSource.definedAtFilePath,
      importStatements,
      filesEnv,
      configValueSource.configEnv
    )
  } else {
    valueData = getValueSerializedWithImport(configValueSource, importStatements, filesEnv, configName)
  }
  return valueData
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

function getValueSerializedWithImport(
  configValueSource: ConfigValueSource,
  importStatements: string[],
  filesEnv: FilesEnv,
  configName: string
): ValueData {
  assert(!configValueSource.valueIsFilePath)

  const { valueIsDefinedByPlusFile, definedAtFilePath, configEnv } = configValueSource
  const { filePathAbsoluteVite, fileExportName } = definedAtFilePath

  if (valueIsDefinedByPlusFile) assert(fileExportName === undefined)
  const { importName } = addImportStatement(
    importStatements,
    filePathAbsoluteVite,
    fileExportName || '*',
    filesEnv,
    configEnv,
    configName
  )

  return {
    type: valueIsDefinedByPlusFile ? 'plus-file' : 'pointer-import',
    valueAsJsCode: importName
  }
}

function getValueSerializedWithJson(
  value: unknown,
  configName: string,
  definedAtData: DefinedAtData,
  importStatements: string[],
  filesEnv: FilesEnv,
  configEnv: ConfigEnvInternal
): ValueData {
  const valueAsJsCode = valueToJson(value, configName, definedAtData, importStatements, filesEnv, configEnv)
  return {
    type: 'js-serialized',
    valueAsJsCode
  }
}
function valueToJson(
  value: unknown,
  configName: string,
  definedAtData: DefinedAtData,
  importStatements: string[],
  filesEnv: FilesEnv,
  configEnv: ConfigEnvInternal
): string {
  const valueName = `config${getPropAccessNotation(configName)}`

  let configValueSerialized: string
  try {
    configValueSerialized = stringify(value, {
      valueName,
      ...stringifyOptions,
      // Replace import strings with import variables.
      // - We don't need this anymore and could remove it.
      //   - We temporarily needed it for nested document configs (`config.document.{title,description,favicon}`), but we finally decided to go for flat document configs instead (`config.{title,description,favicon}`).
      //   - https://github.com/vikejs/vike-react/pull/113
      replacer(_, value) {
        if (typeof value === 'string') {
          const importData = parsePointerImportData(value)
          if (importData) {
            const { importName } = addImportStatement(
              importStatements,
              importData.importPath,
              importData.exportName,
              filesEnv,
              configEnv,
              configName
            )
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
function isJsonValue(value: unknown): boolean {
  try {
    stringify(value, stringifyOptions)
  } catch (err) {
    return false
  }
  return true
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

function getConfigValuesBase(
  pageConfig: PageConfigBuildTime | PageConfigGlobalBuildTime,
  isEnvMatch: (configEnv: ConfigEnvInternal) => boolean,
  isEager: boolean | null
): ConfigValuesBase {
  const fromComputed = Object.entries(pageConfig.configValuesComputed ?? {}).map(([configName, valueInfo]) => {
    const { configEnv, value } = valueInfo
    if (!isEnvMatch(configEnv)) return 'SKIP'
    // Is there a use case for overriding computed values? If yes, then configValeSources has higher precedence
    if (pageConfig.configValueSources[configName]) return 'SKIP'
    const configValueBase = {
      type: 'computed',
      definedAtData: null
    } as const
    return { configValueBase, value, configName, configEnv } as const
  })
  const fromSources = Object.entries(pageConfig.configValueSources).map(([configName, sources]) => {
    const configDef = pageConfig.configDefinitions[configName]
    assert(configDef)
    if (isEager !== null && isEager !== !!configDef.eager) return 'SKIP'
    if (!configDef.cumulative) {
      const source = sources[0]
      assert(source)
      assert(sources.slice(1).every((s) => s.isOverriden === true))
      if (!isEnvMatch(source.configEnv)) return 'SKIP'
      const definedAtFile = getDefinedAtFileSource(source)
      const configValueBase = {
        type: 'standard',
        definedAtData: definedAtFile
      } as const
      return { configValueBase, sourceRelevant: source, configName }
    } else {
      const sourcesRelevant = sources.filter((source) => !source.isOverriden && isEnvMatch(source.configEnv))
      if (sourcesRelevant.length === 0) return 'SKIP'
      const definedAtData: DefinedAtFile[] = []
      sourcesRelevant.forEach((source) => {
        const definedAtFile = getDefinedAtFileSource(source)
        definedAtData.push(definedAtFile)
      })
      const configValueBase = {
        type: 'cumulative',
        definedAtData
      } as const
      return { configValueBase, sourcesRelevant, configName }
    }
  })

  return [...fromComputed, ...fromSources].filter((r) => r !== 'SKIP')
}
type ConfigValuesBase = (
  | {
      configValueBase: {
        type: 'computed'
        definedAtData: null
      }
      value: unknown
      configEnv: ConfigEnvInternal
      configName: string
    }
  | {
      configValueBase: {
        type: 'standard'
        definedAtData: DefinedAtFile
      }
      sourceRelevant: ConfigValueSource
      configName: string
    }
  | {
      configValueBase: {
        type: 'cumulative'
        definedAtData: DefinedAtFile[]
      }
      sourcesRelevant: ConfigValueSource[]
      configName: string
    }
)[]

function getDefinedAtFileSource(source: ConfigValueSource) {
  const definedAtFile: DefinedAtFile = {
    filePathToShowToUser: source.definedAtFilePath.filePathToShowToUser,
    fileExportPathToShowToUser: source.definedAtFilePath.fileExportPathToShowToUser
  }
  return definedAtFile
}

/*
 * Naming:
 *   `import { someExport as someImport } from './some-file'`
 * <=>
 *   `{`
 *      `importPath: './some-file',`
 *      `exportName: 'someExport',`
 *      `importName: 'someImport',`
 *    `}`
 */
function addImportStatement(
  importStatements: string[],
  importPath: string,
  exportName: string,
  filesEnv: FilesEnv,
  configEnv: ConfigEnvInternal,
  configName: string
): { importName: string } {
  const importCounter = importStatements.length + 1
  const importName = `import${importCounter}` as const
  const importLiteral = (() => {
    if (exportName === '*') {
      return `* as ${importName}` as const
    }
    if (exportName === 'default') {
      return importName
    }
    return `{ ${exportName} as ${importName} }` as const
  })()
  const importStatement = `import ${importLiteral} from '${importPath}';`
  importStatements.push(importStatement)
  assertFileEnv(importPath, configEnv, configName, filesEnv)
  return { importName }
}

type FilesEnv = Map<string, { configEnv: ConfigEnvInternal; configName: string }[]>
function assertFileEnv(importPath: string, configEnv: ConfigEnvInternal, configName: string, filesEnv: FilesEnv) {
  const key = importPath
  assert(key)
  assertPosixPath(key)
  assert(!isRelativeImportPath(key))
  if (!filesEnv.has(key)) {
    filesEnv.set(key, [])
  }
  const fileEnvs = filesEnv.get(key)!
  const fileEnvNew = { configEnv, configName }
  fileEnvs.push(fileEnvNew)
  const fileEnvDiff = fileEnvs.filter((c) => !deepEqual(c.configEnv, configEnv))[0]
  if (fileEnvDiff) {
    assertUsage(
      false,
      [
        `${importPath} defines the value of configs living in different environments:`,
        ...[fileEnvDiff, fileEnvNew].map(
          (c) =>
            `  - config ${pc.code(c.configName)} which value lives in environment ${pc.code(
              JSON.stringify(c.configEnv)
            )}`
        ),
        'Defining config values in the same file is allowed only if they live in the same environment, see https://vike.dev/config#pointer-imports'
      ].join('\n')
    )
  }
}

// TODO/now dedupe
function isRelativeImportPath(importPath: string) {
  return importPath.startsWith('./') || importPath.startsWith('../')
}
