import { Config } from 'vite-plugin-ssr/types'

export default {
  passToClient: ['pageProps', 'documentProps'],
  clientRouting: true
} satisfies Config
