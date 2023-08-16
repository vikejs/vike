export { assertPageConfigs }
export { assertPageConfigGlobal }

import { assert, isObject, hasProp } from '../utils.js'
import type { PageConfig, PageConfigGlobal } from '../page-configs/PageConfig.js'

function assertPageConfigs(pageConfigs: unknown): asserts pageConfigs is PageConfig[] {
  assert(Array.isArray(pageConfigs) || pageConfigs === null)
  // TODO: remove obsolete comment?
  // if `plusConfigFilesCannotBeLoaded === null` => then `import.meta.glob('/**/+config.${scriptFileExtensions}', { eager: true })` cannot be transpiled/loaded => code of virtual file cannot be generated or run => assertPageConfigs() is never called
  assert(pageConfigs !== null)
  pageConfigs.forEach((pageConfig) => {
    assert(isObject(pageConfig))
    assert(hasProp(pageConfig, 'pageId', 'string'))
    assert(hasProp(pageConfig, 'routeFilesystem', 'string') || hasProp(pageConfig, 'routeFilesystem', 'null'))
    assert(
      hasProp(pageConfig, 'routeFilesystemDefinedBy', 'string') ||
        hasProp(pageConfig, 'routeFilesystemDefinedBy', 'null')
    )
    assert(hasProp(pageConfig, 'loadCodeFiles', 'function'))
    assert(hasProp(pageConfig, 'isErrorPage', 'boolean'))
    assert(hasProp(pageConfig, 'configElements', 'object'))
    assertConfigElements(pageConfig.configElements, false)
  })
}

function assertPageConfigGlobal(pageConfigGlobal: unknown): asserts pageConfigGlobal is PageConfigGlobal {
  assertConfigElements(pageConfigGlobal, true)
}

function assertConfigElements(configElements: unknown, isGlobalConfig: boolean) {
  assert(isObject(configElements))
  Object.entries(configElements).forEach(([configName, configElement]) => {
    assert(isObject(configElement) || configElement === null)
    if (configElement === null) {
      assert(isGlobalConfig)
      return
    }
    assert(hasProp(configElement, 'configDefinedAt', 'string'))
    assert(
      hasProp(configElement, 'plusConfigFilePath', 'string') || hasProp(configElement, 'plusConfigFilePath', 'null')
    )
    assert(hasProp(configElement, 'configEnv', 'string'))
    assert(hasProp(configElement, 'codeFilePath', 'string') || hasProp(configElement, 'codeFilePath', 'null'))
    assert(hasProp(configElement, 'codeFileExport', 'string') || hasProp(configElement, 'codeFileExport', 'null'))
    assert(
      hasProp(configElement, 'configValueSerialized', 'string') ||
        hasProp(configElement, 'configValueSerialized', 'undefined')
    )
    if (
      isGlobalConfig ||
      // Route files are eagerly loaded (both code files and config value files)
      configName === 'route'
    ) {
      assert(hasProp(configElement, 'configValue') || hasProp(configElement, 'configValueSerialized'))
    }
  })
}
