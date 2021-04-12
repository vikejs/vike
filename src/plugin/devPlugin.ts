import { Plugin } from 'vite'
import { ssrConfig } from './ssrConfig'

export { devPlugin }

function devPlugin(): Plugin {
  return {
    name: 'vite-plugin-ssr:dev',
    apply: 'serve',
    config: () => ({
      ssr: { external: ['vite-plugin-ssr'] },
      optimizeDeps: {
        entries: ['**/*.page.*([a-zA-Z0-9])', '**/*.page.client.*([a-zA-Z0-9])']
      }
    })
  }
}
