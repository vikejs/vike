export { importBuild }

import type { Plugin, ResolvedConfig, Rollup } from 'vite'
import { importBuild as importBuild_, findImportBuildBundleEntry } from '@brillout/vite-plugin-import-build/plugin.js'
import { assert, getOutDirs, projectInfo, toPosixPath, viteIsSSR } from '../../utils.js'
import path from 'path'
import { createRequire } from 'module'
import { getConfigVike } from '../../../shared/getConfigVike.js'
import type { ConfigVikeResolved } from '../../../../shared/ConfigVike.js'
import { getVikeManifest } from './getVikeManifest.js'
import fs from 'fs/promises'
import { virtualFileIdImportUserCodeServer } from '../../../shared/virtual-files/virtualFileImportUserCode.js'
// @ts-ignore Shimmed by dist-cjs-fixup.js for CJS build.
const importMetaUrl: string = import.meta.url
const require_ = createRequire(importMetaUrl)
type Bundle = Rollup.OutputBundle
type Options = Rollup.NormalizedOutputOptions
const ASSETS_MAP = '__VITE_ASSETS_MAP__'

function importBuild(): Plugin[] {
  let config: ResolvedConfig
  let configVike: ConfigVikeResolved
  return [
    {
      name: 'vike:importBuild:config',
      enforce: 'post',
      async configResolved(config_) {
        config = config_
        configVike = await getConfigVike(config)
      },
      async writeBundle(options, bundle) {
        if (!viteIsSSR(config)) return
        await replace_ASSETS_MAP(options, bundle)
      }
    },
    importBuild_({
      getImporterCode: () => {
        return getEntryCode(config, configVike)
      },
      libraryName: projectInfo.projectName
    })
  ]
}

function getEntryCode(config: ResolvedConfig, configVike: ConfigVikeResolved): string {
  const importPath = getImportPath(config)
  const vikeManifest = getVikeManifest(config, configVike)
  const importerCode = [
    `  import { setImportBuildGetters } from '${importPath}';`,
    `  import * as pageFiles from '${virtualFileIdImportUserCodeServer}';`,
    '  setImportBuildGetters({',
    `    pageFiles: () => pageFiles,`,
    // TODO: rename clientManifest -> assetManifest
    `    clientManifest: () => { return ${ASSETS_MAP} },`,
    // TODO: rename pluginManifest -> vikeManifest
    `    pluginManifest: () => (${JSON.stringify(vikeManifest, null, 2)}),`,
    '  });',
    ''
  ].join('\n')
  return importerCode
}
async function replace_ASSETS_MAP(options: Options, bundle: Bundle) {
  const { dir } = options
  assert(dir)
  // I guess importBuild won't be found in the bundle when using @vitejs/plugin-legacy
  const importBuildEntry = findImportBuildBundleEntry(bundle)
  const importBuildFilePath = path.join(dir, importBuildEntry.fileName)
  const assetsJsonFilePath = path.join(dir, '..', 'assets.json')
  const [assetsJsonString, importBuildFileContent] = await Promise.all([
    await fs.readFile(assetsJsonFilePath, 'utf8'),
    await fs.readFile(importBuildFilePath, 'utf8')
  ])
  const importBuildFileContentFixed = importBuildFileContent.replace(ASSETS_MAP, assetsJsonString)
  assert(importBuildFileContentFixed !== importBuildFileContent)
  await fs.writeFile(importBuildFilePath, importBuildFileContentFixed)
}
function getImportPath(config: ResolvedConfig) {
  // We resolve filePathAbsolute even if we don't use it: we use require.resolve() as an assertion that the relative path is correct
  const filePathAbsolute = toPosixPath(
    // [RELATIVE_PATH_FROM_DIST] Current file: node_modules/vike/dist/esm/node/plugin/plugins/importBuild/index.js
    require_.resolve(`../../../../../../dist/esm/node/runtime/globalContext/loadImportBuild.js`)
  )
  if (
    // Let's implement a new config if a user needs the import to be a relative path instead of 'vike/__internal/loadImportBuild' (AFAIK a relative path is needed only if a framework has npm package 'vike' as direct dependency instead of a peer dependency and if the user of that framework uses pnpm)
    true as boolean
  ) {
    return 'vike/__internal/loadImportBuild'
  } else {
    const { outDirServer } = getOutDirs(config)
    const filePathRelative = path.posix.relative(outDirServer, filePathAbsolute)
    return filePathRelative
  }
}
