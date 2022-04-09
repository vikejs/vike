export { previewConfig }

import type { Plugin } from 'vite'
import { apply } from '../utils'
import { getOutDir } from './buildConfig'

function previewConfig(): Plugin {
  return {
    name: 'vite-plugin-ssr:previewConfig',
    apply: apply('preview'),
    config(config) {
      return {
        build: {
          outDir: getOutDir(config),
        },
      }
    },
  }
}
