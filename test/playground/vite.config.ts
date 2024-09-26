import react from '@vitejs/plugin-react'
import vike from 'vike/plugin'

export default {
  // TEST: funky build output directory
  build: {
    outDir: `${__dirname}/../../test/playground/dist/nested`,
    assetsDir: '/nested-dir/assets'
  },
  plugins: [
    react(),
    vike({
      prerender: {
        // TEST: prerender.noExtraDir
        noExtraDir: true
      },
      redirects: {
        // TEST: redirect to email
        '/mail': 'mailto:some@example.com'
      }
    })
  ]
}
