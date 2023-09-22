import type { UserConfig } from 'vite'
import solid from 'vite-plugin-solid'
import ssr from 'vike/plugin'

export default {
  plugins: [solid({ ssr: true }), ssr()]
} satisfies UserConfig
