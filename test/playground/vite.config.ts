import react from '@vitejs/plugin-react'
import assert from 'assert'
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
    configResolved(config: any) {
      assert(config.vike.config)
      assert(config.vike.config.prerender[0].noExtraDir)
      assert(config.vike.pages)
      assert(config.vike.pages['/pages/index'].config.prerender[0] === false)
      assert(config.vike.pages['/pages/markdown'].config.prerender[0])
    }
  }
}
