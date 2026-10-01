export { assertViteVersion }

import { assertUsage } from './assert.js'
import { assertVersion } from './assertVersion.js'

const viteVersionMin = '7.1.0'

// package.json#peerDependencies isn't enough, as users often ignore it
function assertViteVersion(viteVersion: string | undefined) {
  // `viteVersion` is `undefined` when it's this.meta.viteVersion on Vite 6 or older
  assertUsage(viteVersion, `You're using an old Vite version — update Vite to ${viteVersionMin} or above.`)
  assertVersion('Vite', viteVersion, [viteVersionMin])
}
