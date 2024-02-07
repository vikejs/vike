export { importBuild }
export { set_constant_ASSETS_MAP }

import type { Plugin, ResolvedConfig, Rollup } from 'vite'
import { serverEntryPlugin, findServerEntry } from '@brillout/vite-plugin-server-entry/plugin.js'
import { assert, getOutDirs, toPosixPath } from '../../utils.js'
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
      }
    },
    ...serverEntryPlugin({
      getImporterCode: () => {
        return getEntryCode(config, configVike)
      },
      libraryName: 'Vike'
    })
  ]
}

function getEntryCode(config: ResolvedConfig, configVike: ConfigVikeResolved): string {
  const importPath = getImportPath(config)
  const vikeManifest = getVikeManifest(config, configVike)
  const importerCode = [
    `  import { setImportBuildGetters } from '${importPath}';`,
    `  import * as pageFiles from '${virtualFileIdImportUserCodeServer}';`,
    `  {`,
    // We first set the values to a variable because of a Rollup bug, and this workaround doesn't work: https://github.com/vikejs/vike/commit/d5f3a4f7aae5a8bc44192e6cbb2bcb9007be188d
    `    const clientManifest = ${ASSETS_MAP};`,
    `    const pluginManifest = ${JSON.stringify(vikeManifest, null, 2)};`,
    '    setImportBuildGetters({',
    `      pageFiles: () => pageFiles,`,
    // TODO: rename clientManifest -> assetManifest
    `      clientManifest: () => clientManifest,`,
    // TODO: rename pluginManifest -> vikeManifest
    `      pluginManifest: () => pluginManifest,`,
    '    });',
    `  }`,
    ''
  ].join('\n')
  return importerCode
}
/** Set the value of the ASSETS_MAP constant inside dist/server/entry.js (or dist/server/index.js) */
async function set_constant_ASSETS_MAP(options: Options, bundle: Bundle) {
  const { dir } = options
  assert(dir)
  // This will probably fail with @vitejs/plugin-legacy
  //  - See `git log -p` for how we used to workaround the @vitejs/plugin-legacy issue.
  const serverEntry = findServerEntry(bundle)
  const serverEntryFilePath = path.join(dir, serverEntry.fileName)
  const assetsJsonFilePath = path.join(dir, '..', 'assets.json')
  const [assetsJsonString, serverEntryFileContent] = await Promise.all([
    await fs.readFile(assetsJsonFilePath, 'utf8'),
    await fs.readFile(serverEntryFilePath, 'utf8')
  ])
  const serverEntryFileContentPatched = serverEntryFileContent.replace(ASSETS_MAP, assetsJsonString)
  assert(serverEntryFileContentPatched !== serverEntryFileContent)
  await fs.writeFile(serverEntryFilePath, serverEntryFileContentPatched)
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
