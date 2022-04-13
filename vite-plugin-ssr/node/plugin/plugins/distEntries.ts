export { distEntriesPlugin }

import type { Plugin } from 'vite'
import { distImporter } from 'vite-plugin-dist-importer'
import { projectInfo } from '../utils'

const importerCode = [
  "const { __internals: { setDistEntries } } = require('vite-plugin-ssr');",
  'setDistEntries({',
  "  pageFiles: () => import('./pageFiles.js'),",
  "  serverManifest: () => require('./manifest.json'),",
  "  clientManifest: () => require('../client/manifest.json'),",
  "  pluginManifest: () => require('../client/vite-plugin-ssr.json'),",
  '});',
  '',
].join('\n')

function distEntriesPlugin(): Plugin {
  return distImporter({
    importerCode,
    projectName: projectInfo.projectName,
  })
}
