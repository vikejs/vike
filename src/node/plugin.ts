import { Plugin } from 'vite'
import { dirname as pathDirname } from 'path'

const CLIENT_ENTRY = require.resolve(
  'vite-plugin-ssr/client/dist/client/index.js'
)
const CLIENT_DIR = pathDirname(CLIENT_ENTRY)

export { plugin }

function plugin(): Plugin {
  return {
    name: 'vite-plugin-ssr',
    config
  }
}

function config() {
  // CLIENT_DIR may contain $$ which cannot be used as direct replacement
  // string, see https://github.com/vitejs/vite/issues/1732
  const replacement = () => CLIENT_DIR + '/'
  return {
    alias: [
      {
        find: /^\/@vite-plugin-ssr\/client\//,
        // Fix Rollup's incorrect type declaration
        replacement: (replacement as unknown) as string
      }
    ]
  }
}
