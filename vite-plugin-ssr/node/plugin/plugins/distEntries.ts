export { distEntriesPlugin }

import type { Plugin, ResolvedConfig } from 'vite'
import { importBuildPlugin } from 'vite-plugin-import-build/plugin'
import { getOutDirs, projectInfo, toPosixPath } from '../utils'
import path from 'path'

function distEntriesPlugin(): Plugin[] {
  let config: ResolvedConfig
  return [
    {
      name: 'vite-plugin-ssr:distEntries:config',
      enforce: 'post',
      configResolved(config_) {
        config = config_
      }
    },
    importBuildPlugin({
      getImporterCode: ({ findBuildEntry }) => {
        const pageFilesEntry = findBuildEntry('pageFiles')
        return getImporterCode(config, pageFilesEntry)
      },
      libraryName: projectInfo.projectName
    })
  ]
}

function getImporterCode(config: ResolvedConfig, pageFilesEntry: string) {
  const importPathAbsolute = toPosixPath(
    // Current file: node_modules/vite-plugin-ssr/dist/cjs/node/plugin/plugins/distEntries.js
    require.resolve(`../../../../../dist/cjs/node/plugin/plugins/distEntries/loadDistEntries.js`)
  )
  const { outDirServer } = getOutDirs(config)
  const importPath = path.posix.relative(outDirServer, importPathAbsolute)
  const importerCode = [
    `const { setDistEntries } = require('${importPath}');`,
    'setDistEntries({',
    `  pageFiles: () => import('./${pageFilesEntry}'),`,
    "  clientManifest: () => require('../client/manifest.json'),",
    "  pluginManifest: () => require('../client/vite-plugin-ssr.json'),",
    '});',
    ''
  ].join('\n')
  return importerCode
}
