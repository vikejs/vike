import { svelte } from '@sveltejs/vite-plugin-svelte'
import ssr from 'vike/plugin'

export default {
  plugins: [
    svelte({
      compilerOptions: {
        hydratable: true
      }
    }),

    ssr()
  ]
}
