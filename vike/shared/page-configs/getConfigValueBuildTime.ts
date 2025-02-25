export { getConfigValueBuildTime }

import { assert, type ResolveTypeAsString } from '../utils.js'
import type { PageConfigBuildTime, ConfigValue, ConfigValueSource, DefinedAtFile } from './PageConfig.js'
import type { ConfigNameBuiltIn } from './Config.js'
import { assertIsNotProductionRuntime } from '../../utils/assertSetup.js'
import { getConfigValueTyped, type TypeAsString } from './getConfigValueTyped.js'
assertIsNotProductionRuntime()

function getConfigValueBuildTime<Type extends TypeAsString = undefined>(
  pageConfig: PageConfigBuildTime,
  configName: ConfigNameBuiltIn,
  type?: Type
): null | (ConfigValue & { value: ResolveTypeAsString<Type> }) {
  const configValue = getConfigValue(pageConfig, configName)
  if (!configValue) return null
  return getConfigValueTyped(configValue, configName, type)
}

function getConfigValue(pageConfig: PageConfigBuildTime, configName: ConfigNameBuiltIn): null | ConfigValue {
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
  const configDef = configDefinitions[configName]
  assert(configDef)
  if (!configDef.cumulative) {
    const configValueSource = sources[0]
    assert(configValueSource)
    assert(configValueSource.isOverriden === false)
    assert(sources.slice(1).every((s) => s.isOverriden === true))
    assert(configValueSource.valueIsLoaded)
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

    assert(configValueSource.configEnv.config === true)
    assert(configValueSource.valueIsLoaded)

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
