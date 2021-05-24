import { Plugin } from 'vite'

export { dev }

function dev(): Plugin {
  return {
    name: 'vite-plugin-ssr:dev',
    apply: 'serve',
    config: () => ({
      /*
      resolve: {
        extensions: [ '.js', '.json', '.node', '.ts' ],
      },
      //*/
      ssr: { external: ['vite-plugin-ssr', '@vite-plugin-ssr/vue-router'] },
      optimizeDeps: {
        entries: ['**/*.page.*([a-zA-Z0-9])', '**/*.page.client.*([a-zA-Z0-9])']
      }
    })
  }
}
