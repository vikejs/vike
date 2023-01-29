export { assertPageConfigs }

import { assert, isObject, hasProp, assertUsage, isCallable } from '../utils'
import type { PageConfig2 } from './PageConfig'

function assertPageConfigs(pageConfigs: unknown): asserts pageConfigs is PageConfig2[] {
  assert(Array.isArray(pageConfigs) || pageConfigs === null)
  // if `pageConfigFilesCannotBeLoaded === null` => then `import.meta.glob('/**/+config.${scriptFileExtensions}', { eager: true })` cannot be transpiled/loaded => code of virtual file cannot be generated or run => assertPageConfigs() is never called
  assert(pageConfigs !== null)
  pageConfigs.forEach((pageConfig) => {
    assert(isObject(pageConfig))
    assert(hasProp(pageConfig, 'pageId2', 'string'))
    assert(hasProp(pageConfig, 'pageConfigFilePath', 'string'))
    assert(hasProp(pageConfig, 'configSources', 'object'))
    Object.entries(pageConfig.configSources).forEach(([configName, configSource]) => {
      assert(hasProp(configSource, 'c_env', 'string'))
      assert(hasProp(configSource, 'configFilePath', 'string'))
      if ('codeFilePath' in configSource) {
        const { codeFilePath } = configSource
        assert(typeof codeFilePath === 'string')
        if (configName === 'route') {
          assert(hasProp(configSource, 'configValue')) // route files are eagerly loaded
          const { configValue } = configSource
          const configValueType = typeof configValue
          assertUsage(
            configValueType === 'string' || isCallable(configValue),
            `${codeFilePath} has a default export with an invalid type '${configValueType}': the default export should be a string or a function`
          )
        }
      }
    })
    // Already asserted with assertUsage():
    //  - Above (for route files), and
    //  - At config resolve time (when user directly defines a Route String without using a route file)
    assert(hasProp(pageConfig, 'route', 'string') || hasProp(pageConfig, 'route', 'function'))
  })
}
