import react from '@vitejs/plugin-react'

export default {
  // TEST: funky build output directory
  build: {
    outDir: `${__dirname}/../../test/playground/dist/nested`,
    assetsDir: '/nested-dir/assets'
  },
  plugins: [react()]
}
