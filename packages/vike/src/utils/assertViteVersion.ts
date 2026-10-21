export { assertViteVersion }

import { assertUsage } from './assert.js'
import { assertVersion } from './assertVersion.js'

const viteVersionMin = '7.1.0'

// - package.json#peerDependencies isn't enough, as users often ignore it
// - `import { version } from 'vite'` isn't reliable: the user may still use an older Vite version — see https://github.com/vitejs/vite/pull/19355
function assertViteVersion(viteVersion: string | undefined) {
  // `viteVersion` is `undefined` on Vite 6 and older (their `config` hook has no `this`); assertVersion() needs a string
  assertUsage(viteVersion, `You're using an old Vite version — update Vite to ${viteVersionMin} or above.`)
  assertVersion('Vite', viteVersion, [viteVersionMin])
}
