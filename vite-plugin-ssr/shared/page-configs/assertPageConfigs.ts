export { assertPageConfigs }
export { assertPageConfigGlobal }

import { assert, isObject, hasProp, assertUsage, isCallable } from '../utils'
import type { PageConfig, PageConfigGlobal } from './PageConfig'

function assertPageConfigs(pageConfigs: unknown): asserts pageConfigs is PageConfig[] {
  assert(Array.isArray(pageConfigs) || pageConfigs === null)
  // TODO: remove obsolete comment?
  // if `pageConfigFilesCannotBeLoaded === null` => then `import.meta.glob('/**/+config.${scriptFileExtensions}', { eager: true })` cannot be transpiled/loaded => code of virtual file cannot be generated or run => assertPageConfigs() is never called
  assert(pageConfigs !== null)
  pageConfigs.forEach((pageConfig) => {
    assert(isObject(pageConfig))
    assert(hasProp(pageConfig, 'pageId2', 'string'))
    assert(hasProp(pageConfig, 'pageConfigFilePathAll', 'string[]'))
    assert(hasProp(pageConfig, 'routeFilesystem', 'string') || hasProp(pageConfig, 'routeFilesystem', 'null'))
    assert(hasProp(pageConfig, 'routeFilesystemDefinedBy', 'string'))
    assert(hasProp(pageConfig, 'loadCodeFiles', 'function'))
    assert(hasProp(pageConfig, 'isErrorPage', 'boolean'))
    assert(hasProp(pageConfig, 'configSources', 'object'))
    assertConfigSources(pageConfig.configSources, false)
  })
}

function assertPageConfigGlobal(pageConfigGlobal: unknown): asserts pageConfigGlobal is PageConfigGlobal {
  assertConfigSources(pageConfigGlobal, true)
}

function assertConfigSources(configSources: unknown, isGlobalConfig: boolean) {
  assert(isObject(configSources))
  Object.entries(configSources).forEach(([configName, configSource]) => {
    assert(isObject(configSource) || configSource === null)
    if (configSource === null) {
      assert(isGlobalConfig)
      return
    }
    assert(hasProp(configSource, 'configSrc', 'string'))
    assert(hasProp(configSource, 'configFilePath2', 'string') || hasProp(configSource, 'configFilePath2', 'null'))
    assert(hasProp(configSource, 'env', 'string'))
    assert(hasProp(configSource, 'codeFilePath2', 'string') || hasProp(configSource, 'codeFilePath2', 'null'))
    if (isGlobalConfig) {
      assert(hasProp(configSource, 'configValue'))
    }
    if (configSource.codeFilePath2) {
      const { codeFilePath2 } = configSource
      if (configName === 'route') {
        assert(hasProp(configSource, 'configValue')) // route files are eagerly loaded
        const { configValue } = configSource
        const configValueType = typeof configValue
        // TODO: validate earlier?
        assertUsage(
          configValueType === 'string' || isCallable(configValue),
          `${codeFilePath2} has a default export with an invalid type '${configValueType}': the default export should be a string or a function`
        )
      }
    }
  })
}
