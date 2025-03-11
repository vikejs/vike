export { assertSingleInstance_onClientEntryServerRouting }
export { assertSingleInstance_onClientEntryClientRouting }
export { assertSingleInstance_onAssertModuleLoad }

//  - Show warning if there are two different Vike versions loaded
//  - Show warning if entry of Client Routing and entry of Server Routing are both loaded
//  - Show warning if Vike is loaded twice

import { unique } from './unique.js'
import { getGlobalObject } from './getGlobalObject.js'
import pc from '@brillout/picocolors'
import { PROJECT_VERSION } from './PROJECT_VERSION.js'
/* Use original assertWarning() after all CJS is removed from node_modules/vike/dist/
import { assertWarning } from './assert.js'
*/
const globalObject = getGlobalObject<{
  instances: string[]
  checkSingleInstance?: true
  isClientRouting?: boolean
  // For assertWarning() shim
  alreadyLogged: Set<string>
}>('utils/assertSingleInstance.ts', {
  instances: [],
  alreadyLogged: new Set()
})

const clientRuntimesClonflict =
  'Client runtime of both Server Routing and Client Routing loaded https://vike.dev/client-runtimes-conflict'
const clientNotSingleInstance = 'Client runtime loaded twice https://vike.dev/client-runtime-duplicated'

function assertSingleInstance() {
  {
    const versions = unique(globalObject.instances)
    assertWarning(
      versions.length <= 1,
      // Do *NOT* patch Vike to remove this warning: you *will* eventually encounter the issues listed at https://vike.dev/warning/version-mismatch
      // - This happened before: https://github.com/vikejs/vike/issues/1108#issuecomment-1719061509
      `vike@${pc.bold(versions[0]!)} and vike@${pc.bold(versions[1]!)} loaded which is highly discouraged, see ${pc.underline('https://vike.dev/warning/version-mismatch')}`,
      { onlyOnce: true, showStackTrace: false }
    )
  }

  if (globalObject.checkSingleInstance && globalObject.instances.length > 1) {
    /*/ Not sure whether circular dependency can cause problems? In principle not since client-side code is ESM.
    console.warn(clientNotSingleInstance)
    /*/
    assertWarning(false, clientNotSingleInstance, { onlyOnce: true, showStackTrace: true })
    //*/
  }
}

function assertSingleInstance_onClientEntryServerRouting(isProduction: boolean) {
  assertWarning(globalObject.isClientRouting !== true, clientRuntimesClonflict, {
    onlyOnce: true,
    showStackTrace: true
  })
  assertWarning(globalObject.isClientRouting === undefined, clientNotSingleInstance, {
    onlyOnce: true,
    showStackTrace: true
  })
  globalObject.isClientRouting = false
  if (isProduction) globalObject.checkSingleInstance = true
  assertSingleInstance()
}
function assertSingleInstance_onClientEntryClientRouting(isProduction: boolean) {
  assertWarning(globalObject.isClientRouting !== false, clientRuntimesClonflict, {
    onlyOnce: true,
    showStackTrace: true
  })
  assertWarning(globalObject.isClientRouting === undefined, clientNotSingleInstance, {
    onlyOnce: true,
    showStackTrace: true
  })
  globalObject.isClientRouting = true
  if (isProduction) globalObject.checkSingleInstance = true
  assertSingleInstance()
}

// Called by utils/assert.ts which is (most certainly) loaded by all entries. That way we don't have to call a callback for every entry. (There are a lot of entries: `client/router/`, `client/`, `node/runtime/`, `node/plugin/`, `node/cli`.)
function assertSingleInstance_onAssertModuleLoad() {
  globalObject.instances.push(PROJECT_VERSION)
  assertSingleInstance()
}

function assertWarning(
  condition: unknown,
  errorMessage: string,
  { onlyOnce, showStackTrace }: { onlyOnce: boolean | string; showStackTrace: boolean }
): void {
  if (condition) {
    return
  }
  const msg = `[Vike][Warning] ${errorMessage}`
  if (onlyOnce) {
    const { alreadyLogged } = globalObject
    const key = onlyOnce === true ? msg : onlyOnce
    if (alreadyLogged.has(key)) {
      return
    } else {
      alreadyLogged.add(key)
    }
  }
  if (showStackTrace) {
    console.warn(new Error(msg))
  } else {
    console.warn(msg)
  }
}
