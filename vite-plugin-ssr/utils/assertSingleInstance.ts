export { onClientEntry_ServerRouting }
export { onClientEntry_ClientRouting }
export { onProjectInfo }

// Ensures:
//  - There aren't two different versions of vite-plugin-ssr loaded
//  - On the client-side, entry for Client Routing and entry for Server Routing aren't loaded at the same time
//  - On the client-side, vite-plugin-ssr isn't loaded twice

import { unique } from './unique'
import { getGlobalObject } from './getGlobalObject'
import { assertUsage } from './assert'
const globalObject = getGlobalObject<{ instances: string[]; checkSingleInstance?: true; isClientRouting?: boolean }>(
  'assertPackageInstances.ts',
  { instances: [] }
)
const makeSure = "Make sure your client-side code doesn't load"
const clientEntryClonflict = `Server Routing and Client Routing both loaded. ${makeSure} both at the same time.`
const clientNotSingleInstance = `vite-plugin-ssr loaded twice. ${makeSure} vite-plugin-ssr twice (in order to reduce client size).`

function assertSingleInstance() {
  {
    const versions = unique(globalObject.instances)
    if (versions.length > 1) {
      const errMsg = `Multiple versions \`vite-plugin-ssr@${versions[0]}\` and \`vite-plugin-ssr@${versions[1]}\` loaded. Make sure only one version is loaded.`
      /*/ Not sure whether circular dependency can cause problems?
      throw new Error(errMsg)
      /*/
      assertUsage(false, errMsg)
      //*/
    }
  }

  if (globalObject.checkSingleInstance && globalObject.instances.length > 1) {
    /*/ Not sure whether circular dependency can cause problems?
    throw new Error(clientNotSingleInstance)
    /*/
    assertUsage(false, clientNotSingleInstance)
    //*/
  }
}

function onClientEntry_ServerRouting(isProduction: boolean) {
  assertUsage(globalObject.isClientRouting !== true, clientEntryClonflict)
  assertUsage(globalObject.isClientRouting === undefined, clientNotSingleInstance)
  globalObject.isClientRouting = false
  if (isProduction) globalObject.checkSingleInstance = true
  assertSingleInstance()
}
function onClientEntry_ClientRouting(isProduction: boolean) {
  assertUsage(globalObject.isClientRouting !== false, clientEntryClonflict)
  assertUsage(globalObject.isClientRouting === undefined, clientNotSingleInstance)
  globalObject.isClientRouting = true
  if (isProduction) globalObject.checkSingleInstance = true
  assertSingleInstance()
}

// Called by utils/projectInfo.ts which is loaded by all entries (since utils/asserts.ts depends on utils/projectInfo.ts, we can have confidence that onProjectInfo() is called by each entry). That way we don't have to call a callback for every entry (there are a *lot* of entries: `client/router/`, `client/`, `node/runtime/`, `node/plugin/`, `node/cli`).
function onProjectInfo(projectVersion: string) {
  globalObject.instances.push(projectVersion)
  assertSingleInstance()
}
