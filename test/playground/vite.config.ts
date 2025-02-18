import react from '@vitejs/plugin-react'
import assert from 'node:assert'
import { getVikeConfig } from 'vike/plugin'
import type { PluginOption } from 'vite'

export default {
  // TEST: funky build output directory
  build: {
    outDir: `${__dirname}/../../test/playground/dist/nested`,
    assetsDir: '/nested-dir/assets'
  },
  plugins: [react(), testPlugin()]
}

function testPlugin(): PluginOption {
  return {
    name: 'testPlugin',
    configResolved(config) {
      const vike = getVikeConfig(config as any)
      assert(vike.config)
      assert(typeof vike.config.prerender![0] === 'object')
      assert(vike.config.prerender![0].noExtraDir)
      assert(vike.pages)
      assert(vike.pages['/pages/index']!.config.prerender![0] === false)
      assert(vike.pages['/pages/markdown']!.config.prerender![0] === true)
    }
  }
}
