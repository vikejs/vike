import react from '@vitejs/plugin-react'
import vike from 'vike/plugin'

export default {
  // TEST: funky build output directory
  build: {
    outDir: `${__dirname}/../../test/playground/dist/nested`,
    assetsDir: '/nested-dir/assets'
  },
  plugins: [vike(), react()]
}
