import react from '@vitejs/plugin-react'
import vike from 'vike/plugin'
import { assertFileRuntime } from '../../vike/node/plugin/plugins/fileRuntime'

export default {
  build: {
    outDir: `${__dirname}/../../test/misc/dist/nested`
  },
  plugins: [
    react(),
    vike({
      prerender: {
        noExtraDir: true
      }
    }),
    assertFileRuntime()
  ]
}
