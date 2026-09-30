import vike from 'vike/plugin'
import type { Plugin, UserConfig } from 'vite'

export default {
  plugins: [vike(), emitAsset()],
} satisfies UserConfig

// A file written by the client build that isn't in the manifest
function emitAsset(): Plugin {
  return {
    name: 'test:emit-asset',
    apply: 'build',
    generateBundle() {
      if (this.environment.name !== 'client') return
      this.emitFile({ type: 'asset', fileName: 'emitted.txt', source: 'Emitted by a plugin' })
    },
  }
}
