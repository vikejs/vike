export { assertViteVersion }
export { viteVersionMin }

import { assertVersion } from './assertVersion.js'

const viteVersionMin = '6.3.0'

// node_modules/vike/package.json#peerDependencies isn't enough, as users often ignore it
function assertViteVersion(viteVersion: string) {
  // - This assertion isn't reliable: the user may still use a Vite version older than 6.0.0 — see https://github.com/vitejs/vite/pull/19355
  //   - TO-DO/eventually: let's also use this.meta.viteVersion
  //     - this.meta.viteVersion was released in vite@7.0.0 => let's use it only after Vike requires a Vite version above 7.0.0
  //     - https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md#700-2025-06-24
  //     - https://github.com/vitejs/vite/pull/20088
  //     - We can then remove the assertUsage() at isViteServerSide.ts — see viteVersionMin export usage
  assertVersion('Vite', viteVersion, [viteVersionMin])
}
