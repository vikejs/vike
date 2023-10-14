export { assertPageConfigs }
export { assertPageConfigGlobal }

import { assert, isObject, hasProp } from '../utils.js'
import type { PageConfigGlobalSerialized, PageConfigSerialized } from '../page-configs/PageConfig.js'

function assertPageConfigs(pageConfigs: unknown): asserts pageConfigs is PageConfigSerialized[] {
  assert(Array.isArray(pageConfigs))
  pageConfigs.forEach((pageConfig) => {
    assert(isObject(pageConfig))
    assert(hasProp(pageConfig, 'pageId', 'string'))
    assert(hasProp(pageConfig, 'routeFilesystem'))
  })
}

function assertPageConfigGlobal(pageConfigGlobal: unknown): asserts pageConfigGlobal is PageConfigGlobalSerialized {
  assert(pageConfigGlobal)
  assert(hasProp(pageConfigGlobal, 'configValues'))
  assert(hasProp(pageConfigGlobal, 'configValuesImported'))
}
