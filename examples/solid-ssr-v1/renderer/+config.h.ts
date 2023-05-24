import { Config } from 'vite-plugin-ssr/types'

// https://vite-plugin-ssr.com/config
export default {
  passToClient: ['pageProps', 'documentProps'],
  clientRouting: true
} satisfies Config
