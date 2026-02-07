import vue from '@vitejs/plugin-vue'
import md from 'unplugin-vue-markdown/vite'
import vike from 'vike/plugin'
import type { UserConfig } from 'vite'
import { cjsInterop } from 'vite-plugin-cjs-interop'

const config: UserConfig = {
  plugins: [
    vike(),
    vue({
      include: [/\.vue$/, /\.md$/],
    }),
    md({}),
    cjsInterop({
      dependencies: ['vue-toast-notification'],
    }),
  ],
  legacy: {
    // @ts-ignore Vite 8 setting (we're currently using Vite 7)
    // https://discord.com/channels/804011606160703521/831456449632534538/1469360902670385325
    // https://main.vite.dev/guide/migration#consistent-commonjs-interop
    inconsistentCjsInterop: true,
  },
}

export default config
