import type { Plugin } from 'vite'
import { dirname as pathDirname } from 'path'

const CLIENT_ENTRY = require.resolve(
  'vite-plugin-ssr/client/dist/client/index.js'
)
const CLIENT_DIR = pathDirname(CLIENT_ENTRY)
console.log('cd', CLIENT_DIR)

export { plugin }

function plugin(): Plugin {
  return {
    name: 'vite-plugin-ssr',
    // @ts-ignore
    config: () => ({
      alias: [
        {
          find: /^\/vite-plugin-ssr\/client\//,
          replacement: () => CLIENT_DIR + '/'
        }
      ]
    })
  }
}
