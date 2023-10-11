import type { UserConfig } from 'vite'
import solid from 'vite-plugin-solid'
import vike from 'vike/plugin'

export default {
  plugins: [solid({ ssr: true }), vike()]
} satisfies UserConfig
