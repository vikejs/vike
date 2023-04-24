import { svelte } from '@sveltejs/vite-plugin-svelte'
import ssr from 'vite-plugin-ssr/plugin'

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
