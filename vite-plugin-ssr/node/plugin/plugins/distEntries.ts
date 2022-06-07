export { distEntriesPlugin }

import type { Plugin, ResolvedConfig } from 'vite'
import type { NormalizedOutputOptions, OutputBundle } from 'rollup'
import { distImporter } from 'vite-plugin-dist-importer'
import { getOutDirs, projectInfo, pathRelative, pathJoin, assert } from '../utils'

function distEntriesPlugin(): Plugin[] {
  let config: ResolvedConfig
  return [
    {
      name: 'vite-plugin-ssr:distEntries:config',
      enforce: 'post',
      configResolved(config_) {
        config = config_
      },
    },
    distImporter({
      getImporterCode: ({ rollup }) => getImporterCode(config, rollup),
      projectName: projectInfo.projectName,
    }),
  ]
}

function getImporterCode(config: ResolvedConfig, rollup: { options: NormalizedOutputOptions; bundle: OutputBundle }) {
  // Current directory: vite-plugin-ssr/dist/cjs/node/plugin/plugins/
  const importPathAbsolute = require.resolve(`../../../../../dist/cjs/node/plugin/plugins/distEntries/loadDistEntries`)
  const { outDirServer } = getOutDirs(config.build.outDir)
  const outDirServerAbsolute = pathJoin(config.root, outDirServer)
  const importPath = pathRelative(outDirServerAbsolute, importPathAbsolute)
  const fileExt = getFileExt(rollup)
  const pageFilesOutput = `pageFiles.${fileExt}`
  {
    const bundleFiles = Object.keys(rollup.bundle)
    assert(bundleFiles.includes(pageFilesOutput))
  }
  const importerCode = [
    `const { setDistEntries } = require('${importPath}');`,
    'setDistEntries({',
    `  pageFiles: () => import('./${pageFilesOutput}'),`,
    "  clientManifest: () => require('../client/manifest.json'),",
    "  pluginManifest: () => require('../client/vite-plugin-ssr.json'),",
    '});',
    '',
  ].join('\n')
  return importerCode
}

function getFileExt(rollup: { options: NormalizedOutputOptions; bundle: OutputBundle }): 'js' | 'mjs' {
  const { entryFileNames } = rollup.options
  const fileExt = typeof entryFileNames === 'string' && entryFileNames.endsWith('.mjs') ? 'mjs' : 'js'
  return fileExt
}
