export { getConfigValueBuildTime }

import { assert, type ResolveTypeAsString } from '../utils.js'
import type { PageConfigBuildTime, ConfigValue, ConfigValueSource, DefinedAtFile } from './PageConfig.js'
import type { ConfigNameBuiltIn } from './Config.js'
import { getConfigValueTyped, type TypeAsString } from './getConfigValue.js'
import { assertIsNotProductionRuntime } from '../../utils/assertIsNotProductionRuntime.js'
assertIsNotProductionRuntime()
type ConfigName = ConfigNameBuiltIn

function getConfigValueBuildTime<Type extends TypeAsString = undefined>(
  pageConfig: PageConfigBuildTime,
  configName: ConfigName,
  type?: Type
): null | (ConfigValue & { value: ResolveTypeAsString<Type> }) {
  const configValue = getConfigValue(pageConfig, configName)
  if (!configValue) return null
  return getConfigValueTyped(configValue, configName, type)
}

function getConfigValue(pageConfig: PageConfigBuildTime, configName: ConfigName): null | ConfigValue {
  const { configValueSources, configValuesComputed, configDefinitions } = pageConfig

  const configValueComputed = configValuesComputed[configName]
  if (configValueComputed) {
    return {
      type: 'computed',
      value: configValueComputed.value,
      definedAtData: null
    }
  }

  const sources = configValueSources[configName]
  if (!sources) return null
  /* TODO: try this assert after refactor
  assert(sources.every((s) => s.configEnv.config === true))
  */
  const configDef = configDefinitions[configName]
  assert(configDef)
  if (!configDef.cumulative) {
    const configValueSource = sources[0]
    assert(configValueSource)
    assert(configValueSource.isOverriden === false)
    assert(sources.slice(1).every((s) => s.isOverriden === true))
    /* TODO: try this assert after refactor
    assert('value' in configValueSource)
    /*/
    if (!('value' in configValueSource)) return null
    //*/
    return {
      type: 'standard',
      value: configValueSource.value,
      definedAtData: getDefinedAtFile(configValueSource)
    }
  } else {
    const { value, definedAtData } = mergeCumulative(sources)
    assert(value.length === definedAtData.length)
    return {
      type: 'cumulative',
      value,
      definedAtData
    }
  }
}

function mergeCumulative(configValueSources: ConfigValueSource[]) {
  const value: unknown[] = []
  const definedAtData: DefinedAtFile[] = []
  configValueSources.forEach((configValueSource) => {
    assert(configValueSource.isOverriden === false)

    /* TODO: try this assert after refactor
    assert(configValueSource.configEnv.config === true)
    assert('value' in configValueSource)
    /*/
    // Imported and merged at runtime
    if (!('value' in configValueSource)) return

    value.push(configValueSource.value)
    definedAtData.push(getDefinedAtFile(configValueSource))
  })
  return { value, definedAtData }
}

function getDefinedAtFile(configValueSource: ConfigValueSource): DefinedAtFile {
  return {
    filePathToShowToUser: configValueSource.definedAtFilePath.filePathToShowToUser,
    fileExportPathToShowToUser: configValueSource.definedAtFilePath.fileExportPathToShowToUser
  }
}
