import react from '@vitejs/plugin-react'
import vike from 'vike/plugin'

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
    })
  ]
}
