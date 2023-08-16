export { assertRuntimeManifest }
export type { RuntimeManifest }

import { assert, castType, checkType, hasProp, isBaseAssets, isBaseServer, isObject } from './utils.js'

type RuntimeManifest = {
  baseServer: string
  baseAssets: string
  includeAssetsImportedByServer: boolean
  redirects: Record<string, string>
}

function assertRuntimeManifest(obj: unknown): asserts obj is RuntimeManifest & Record<string, unknown> {
  assert(obj)
  assert(isObject(obj))
  assert(hasProp(obj, 'baseServer', 'string'))
  assert(hasProp(obj, 'baseAssets', 'string'))
  assert(isBaseServer(obj.baseServer))
  assert(isBaseAssets(obj.baseAssets))
  assert(hasProp(obj, 'includeAssetsImportedByServer', 'boolean'))
  assert(hasProp(obj, 'redirects', 'object'))
  castType<{ redirects: Record<string, string> }>(obj)
  checkType<RuntimeManifest>(obj)
}
