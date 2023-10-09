import { svelte } from '@sveltejs/vite-plugin-svelte'
import vike from 'vike/plugin'

export default {
  plugins: [
    svelte({
      compilerOptions: {
        hydratable: true
      }
    }),

    vike()
  ]
}
