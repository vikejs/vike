export { assertVirtualFileExports }

import { assert } from '../../utils/assert.js'

function assertVirtualFileExports<ModuleExports>(
  moduleExports: ModuleExports,
  test: (moduleExports: ModuleExports) => boolean,
  moduleId?: string,
) {
  if (!moduleExports || !test(moduleExports)) {
    /* https://github.com/vikejs/vike/issues/2903#issuecomment-3642285811
    throw getProjectError('@cloudflare/vite-plugin error https://github.com/vikejs/vike/issues/2903#issuecomment-3642285811')
    /*/
    assert(false, { moduleExports, moduleExportsKeys: getKeys(moduleExports), moduleId })
    //*/
  }
}

function getKeys(obj: any) {
  if (obj === undefined) return null
  return [...Object.getOwnPropertyNames(obj), ...Object.getOwnPropertySymbols(obj), ...Object.keys(obj)]
}
