import { Plugin } from 'vite'

export { dev }

function dev(): Plugin {
  return {
    name: 'vite-plugin-ssr:dev',
    apply: 'serve',
    config: () => ({
      ssr: { external: ['vite-plugin-ssr'] },
      optimizeDeps: {
        entries: ['**/*.page.*([a-zA-Z0-9])', '**/*.page.client.*([a-zA-Z0-9])'],
        exclude: ['vite-plugin-ssr/client', 'vite-plugin-ssr/client/router'],
        include: ['@brillout/libassert']
      }
    })
  }
}
