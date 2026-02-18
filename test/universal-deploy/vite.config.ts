import { telefunc } from 'telefunc/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import vike from 'vike/plugin'
import { devServer } from '@universal-deploy/store/vite'
// import { node } from '@universal-deploy/node/vite'

const re_catchAll = /^virtual:ud:catch-all$/

export function photon(options: { entry: string }): Plugin[] {
  return [
    {
      name: 'photon:node:resolve-local-entry',
      resolveId: {
        order: 'pre',
        filter: {
          id: re_catchAll,
        },
        handler() {
          // Will resolve the entry from the users project root
          return this.resolve(options.entry)
        },
      },
    },
  ]
}

export default defineConfig({
  plugins: [
    vike(),
    react(),
    telefunc(),
    photon({ entry: './express-entry.ts' }),
    // FIXME fix conditions
    // node(),
    // FIXME fix telefunc
    devServer(),
  ],
})
