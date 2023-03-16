export { assertRuntimeManifest }
export type { RuntimeManifest }

import { assert, checkType, hasProp, isBaseAssets, isBaseServer, isObject } from './utils'

type RuntimeManifest = {
  baseServer: string
  baseAssets: string
  includeAssetsImportedByServer: boolean
}

function assertRuntimeManifest(obj: unknown): asserts obj is RuntimeManifest & Record<string, unknown> {
  assert(obj)
  assert(isObject(obj))
  assert(hasProp(obj, 'baseServer', 'string'))
  assert(hasProp(obj, 'baseAssets', 'string'))
  assert(isBaseServer(obj.baseServer))
  assert(isBaseAssets(obj.baseAssets))
  assert(hasProp(obj, 'includeAssetsImportedByServer', 'boolean'))
  checkType<RuntimeManifest>(obj)
}
