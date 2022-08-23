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
  // Current directory: vite-plugin-ssr/dist/cjs/node/plugin/plugins/
  const importPathAbsolute = toPosixPath(
    require.resolve(`../../../../../dist/cjs/node/plugin/plugins/distEntries/loadDistEntries`)
  )
  const { outDirServer } = getOutDirs(config.build.outDir)
  const outDirServerAbsolute = path.posix.join(config.root, outDirServer)
  const importPath = path.posix.relative(outDirServerAbsolute, importPathAbsolute)
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
