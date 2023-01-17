export { assertPageConfigs }

import { assert, isObject, hasProp } from '../utils'
import type { PageConfig2 } from './PageConfig'

function assertPageConfigs(pageConfigs: unknown): asserts pageConfigs is PageConfig2[] {
  assert(Array.isArray(pageConfigs) || pageConfigs === null)
  // if `pageConfigFilesCannotBeLoaded === null` => then `import.meta.glob('/**/+config.${scriptFileExtensions}', { eager: true })` cannot be transpiled/loaded => code of virtual file cannot be generated or run => assertPageConfigs() is never called
  assert(pageConfigs !== null)
  pageConfigs.forEach((pageConfig) => {
    assert(isObject(pageConfig))
    assert(hasProp(pageConfig, 'pageId2', 'string'))
    assert(hasProp(pageConfig, 'route', 'string'))
    assert(hasProp(pageConfig, 'configSources', 'object'))
  })
}
