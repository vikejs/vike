export { distEntriesPlugin }

import type { Plugin, ResolvedConfig } from 'vite'
import type { NormalizedOutputOptions, OutputBundle } from 'rollup'
import { distImporter } from 'vite-plugin-dist-importer'
import { getOutDirs, projectInfo, pathRelative, pathJoin } from '../utils'
import { analyzeRollupConfig } from '../utils/analyzeRollupConfig'

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
  const { pageFilesOutput } = analyzeRollupConfig(rollup, config)
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
