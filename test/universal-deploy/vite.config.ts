import { telefunc } from 'telefunc/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import vike from 'vike/plugin'
import { devServer } from '@universal-deploy/store/vite'
import { node } from '@universal-deploy/node/vite'

export default defineConfig({
  plugins: [vike(), react(), telefunc(), node(), devServer()],
})
