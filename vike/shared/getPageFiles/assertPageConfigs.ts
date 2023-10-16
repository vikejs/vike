export { assertPageConfigsSerialized }
export { assertPageConfigGlobalSerialized }

import { assert, isObject, hasProp } from '../utils.js'
import type { PageConfigGlobalSerialized, PageConfigRuntimeSerialized } from '../page-configs/PageConfig.js'

function assertPageConfigsSerialized(
  pageConfigsSerialized: unknown
): asserts pageConfigsSerialized is PageConfigRuntimeSerialized[] {
  assert(Array.isArray(pageConfigsSerialized))
  pageConfigsSerialized.forEach((pageConfigSerialized) => {
    assert(isObject(pageConfigSerialized))
    assert(hasProp(pageConfigSerialized, 'pageId', 'string'))
    assert(hasProp(pageConfigSerialized, 'routeFilesystem'))
    assert(hasProp(pageConfigSerialized, 'configValuesSerialized'))
    assert(hasProp(pageConfigSerialized, 'configValuesImported'))
  })
}

function assertPageConfigGlobalSerialized(
  pageConfigGlobalSerialized: unknown
): asserts pageConfigGlobalSerialized is PageConfigGlobalSerialized {
  assert(hasProp(pageConfigGlobalSerialized, 'configValuesImported'))
}
