import { telefunc } from 'telefunc/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import vike from 'vike/plugin'
import { node } from '@universal-deploy/node/vite'

export default defineConfig({
  plugins: [vike(), react(), telefunc(), node()],
})
