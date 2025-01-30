export { assertRuntimeManifest }
export type { RuntimeManifest }

import { assert, hasProp, isObject } from './utils.js'

type RuntimeManifest = {
  viteConfigRuntime: {
    _baseViteOriginal: string
  }
}

function assertRuntimeManifest(obj: unknown): asserts obj is RuntimeManifest & Record<string, unknown> {
  assert(obj)
  assert(isObject(obj))
  assert(hasProp(obj, 'viteConfigRuntime', 'object'))
  assert(hasProp(obj.viteConfigRuntime, '_baseViteOriginal', 'string'))
}
