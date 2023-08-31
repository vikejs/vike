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
  })
}

function assertPageConfigGlobal(pageConfigGlobal: unknown): asserts pageConfigGlobal is PageConfigGlobal {
  // TODO: remove or implement?
}
