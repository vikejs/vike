export { assertPageConfigs }
export { assertPageConfigGlobal }

import { assert, isObject, hasProp } from '../utils.js'
import type { PageConfig, PageConfigGlobal } from '../page-configs/PageConfig.js'

function assertPageConfigs(pageConfigs: unknown): asserts pageConfigs is PageConfig[] {
  assert(Array.isArray(pageConfigs))
  pageConfigs.forEach((pageConfig) => {
    assert(isObject(pageConfig))
    assert(hasProp(pageConfig, 'pageId', 'string'))
    assert(hasProp(pageConfig, 'routeFilesystem'))
  })
}

function assertPageConfigGlobal(pageConfigGlobal: unknown): asserts pageConfigGlobal is PageConfigGlobal {
  assert(pageConfigGlobal)
  assert(hasProp(pageConfigGlobal, 'configValues'))
  assert(hasProp(pageConfigGlobal, 'configValuesImported'))
}
