import react from '@vitejs/plugin-react'
import vike from 'vike/plugin'

export default {
  server: {
    headers: {
      'cross-origin-opener-policy': 'same-origin',
      'cross-origin-embedder-policy': 'credentialless'
    }
  },
  preview: {
    headers: {
      'cross-origin-opener-policy': 'same-origin',
      'cross-origin-embedder-policy': 'require-corp'
    }
  },
  build: {
    outDir: `${__dirname}/../../test/misc/dist/nested`,
    assetsDir: '/nested-dir/assets'
  },
  plugins: [
    react(),
    vike({
      prerender: {
        noExtraDir: true
      },
      redirects: {
        '/mail': 'mailto:some@example.com'
      }
    })
  ]
}
