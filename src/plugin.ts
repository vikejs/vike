import type { Plugin } from 'vite'
import { dirname as pathDirname } from 'path'

const CLIENT_ENTRY = require.resolve('vite-plugin-ssr/dist/index.js')
const CLIENT_DIR = pathDirname(CLIENT_ENTRY)
console.log('cd', CLIENT_DIR)

export { plugin }

function plugin(): Plugin {
  return {
    name: 'vite-plugin-ssr',
    config: () => ({
      // alias: [{ find: /^\/vite-plugin-ssr\//, replacement: () => CLIENT_DIR + '/' }]
      // alias: [{ find: /^\/vite-plugin-ssr\//, replacement: CLIENT_DIR + '/' }]
      alias: [{ find: /^\/vite-plugin-ssr\/browser/, replacement: CLIENT_DIR + '/browser' }]
    })
  }
}
