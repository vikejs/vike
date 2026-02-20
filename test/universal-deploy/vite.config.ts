import { telefunc } from 'telefunc/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import vike from 'vike/plugin'
import { node } from '@universal-deploy/node/vite'

export default defineConfig({
  plugins: [
    vike(),
    react(),
    telefunc(),
    // TODO currently vike-photon has some heuristics to determine which target to use.
    //  Extract this logic to a new `@universal-deploy/auto` or directly into Vike
    //  https://github.com/vikejs/vike-photon/blob/438bffdb9a82650a49ee5345a82d0cc779afc3c8/packages/vike-photon/src/plugin/plugins/targets.ts#L25
    node(),
  ],
})
