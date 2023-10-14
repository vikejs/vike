export { assertPageConfigs }
export { assertPageConfigGlobal }

import { assert, isObject, hasProp } from '../utils.js'
import type { PageConfigGlobalSerialized, PageConfigSeriliazed } from '../page-configs/PageConfig.js'

function assertPageConfigs(pageConfigs: unknown): asserts pageConfigs is PageConfigSeriliazed[] {
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
