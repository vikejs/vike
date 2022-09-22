export { addPackageInstance }
export { assertIsBundledOnce }

import { unique } from './unique'
import { getGlobalObject } from './getGlobalObject'
const globalObject = getGlobalObject<{ instances: string[]; checkBundle?: true; alreadyWarned?: true }>(
  'assertPackageInstances.ts',
  {
    instances: []
  }
)

function assertSingleVersion() {
  const versions = unique(globalObject.instances)
  if (versions.length > 1) {
    throw new Error(
      `Multiple versions \`vite-plugin-ssr@${versions[0]}\` and \`vite-plugin-ssr@${versions[1]}\` loaded. Make sure only one version is loaded.`
    )
  }
}

function assertBundle() {
  if (!globalObject.checkBundle) {
    return
  }
  if (globalObject.instances.length <= 1) {
    return
  }
  if (globalObject.alreadyWarned) {
    return
  }
  console.warn(
    'vite-plugin-ssr is included twice in your bundle, which should be avoided in order reduce KBs loaded by the browser'
  )
  globalObject.alreadyWarned = true
}
function assertIsBundledOnce() {
  globalObject.checkBundle = true
  assertBundle()
}

function addPackageInstance(projectVersion: string) {
  globalObject.instances.push(projectVersion)
  assertSingleVersion()
  assertBundle()
}
