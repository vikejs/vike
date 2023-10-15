export { assertPageConfigsSerialized }
export { assertPageConfigGlobalSerialized }

import { assert, isObject, hasProp } from '../utils.js'
import type { PageConfigGlobalSerialized, PageConfigSerialized } from '../page-configs/PageConfig.js'

function assertPageConfigsSerialized(
  pageConfigsSerialized: unknown
): asserts pageConfigsSerialized is PageConfigSerialized[] {
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
