export { distEntriesPlugin }

import type { Plugin, ResolvedConfig } from 'vite'
import { distImporter } from 'vite-plugin-dist-importer'
import { getOutDirs, projectInfo, toPosixPath } from '../utils'
import path from 'path'

function distEntriesPlugin(): Plugin[] {
  let config: ResolvedConfig
  return [
    {
      name: 'vite-plugin-ssr:distEntries:config',
      configResolved(config_) {
        config = config_
      },
    },
    distImporter({
      getImporterCode: () => getImporterCode(config),
      projectName: projectInfo.projectName,
    }),
  ]
}

function getImporterCode(config: ResolvedConfig) {
  // Current directory: vite-plugin-ssr/dist/cjs/node/plugin/plugins/
  const importPathAbsolute = require.resolve(`../../../../../dist/cjs/node/plugin/plugins/distEntries/loadDistEntries`)
  const { outDirServer } = getOutDirs(config.build.outDir)
  const importPath = path.posix.relative(toPosixPath(outDirServer), toPosixPath(importPathAbsolute))
  const importerCode = [
    `const { setDistEntries } = require('${importPath}');`,
    'setDistEntries({',
    "  pageFiles: () => import('./pageFiles.js'),",
    "  clientManifest: () => require('../client/manifest.json'),",
    "  pluginManifest: () => require('../client/vite-plugin-ssr.json'),",
    '});',
    '',
  ].join('\n')
  return importerCode
}
