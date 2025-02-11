import type { UserConfig } from 'vite'

export default {
  // TEST: funky build output directory
  build: {
    outDir: `${__dirname}/../../test/playground/dist/nested`,
    assetsDir: '/nested-dir/assets'
  }
} satisfies UserConfig
