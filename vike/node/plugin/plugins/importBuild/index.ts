export { importBuild }

import type { Plugin, ResolvedConfig } from 'vite'
import { importBuild as importBuild_ } from '@brillout/vite-plugin-import-build/plugin.js'
import { getOutDirs, projectInfo, toPosixPath } from '../../utils.js'
import path from 'path'
import { createRequire } from 'module'
// @ts-ignore Shimed by dist-cjs-fixup.js for CJS build.
const importMetaUrl: string = import.meta.url
const require_ = createRequire(importMetaUrl)

function importBuild(): Plugin[] {
  let config: ResolvedConfig
  return [
    {
      name: 'vike:importBuild:config',
      enforce: 'post',
      configResolved(config_) {
        config = config_
      }
    },
    importBuild_({
      getImporterCode: ({ findBuildEntry }) => {
        const pageFilesEntry = findBuildEntry('pageFiles')
        return getImporterCode(config, pageFilesEntry)
      },
      libraryName: projectInfo.projectName
    })
  ]
}

function getImporterCode(config: ResolvedConfig, pageFilesEntry: string) {
  const importPath = getImportPath(config)

  // The only reason we went for using CJS require() instead of ESM import() is because import() doesn't support .json files
  const importerCode = [
    '(async () => {',
    `  const { setImportBuildGetters } = await import('${importPath}');`,
    '  setImportBuildGetters({',
    `    pageFiles: () => import('./${pageFilesEntry}'),`,
    // TODO: rename clientManifest -> assetManifest
    // TODO: rename PluginManifest -> vikeManifest
    // TODO: use virtual file instead of generating vike.json
    "    clientManifest: () => require('../assets.json'),",
    "    pluginManifest: () => require('../client/vike.json'),",
    '  });',
    '})()',
    ''
  ].join('\n')
  return importerCode
}
function getImportPath(config: ResolvedConfig) {
  const filePathAbsolute = toPosixPath(
    // [RELATIVE_PATH_FROM_DIST] Current file: node_modules/vike/dist/esm/node/plugin/plugins/importBuild/index.js
    require_.resolve(`../../../../../../dist/esm/node/runtime/globalContext/loadImportBuild.js`)
  )
  const { outDirServer } = getOutDirs(config)
  const filePathRelative = path.posix.relative(outDirServer, filePathAbsolute)
  return filePathRelative
}
