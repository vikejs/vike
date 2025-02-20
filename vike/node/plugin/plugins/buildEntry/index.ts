export { buildEntry }
export { set_ASSETS_MANIFEST }

import { serverProductionEntryPlugin } from '@brillout/vite-plugin-server-entry/plugin'
import { virtualFileIdImportUserCodeServer } from '../../../shared/virtual-files/virtualFileImportUserCode.js'
import { assert, projectInfo, toPosixPath } from '../../utils.js'
import fs from 'fs/promises'
import path from 'path'
import { createRequire } from 'module'
// @ts-ignore import.meta.url is shimmed at dist/cjs by dist-cjs-fixup.js.
const importMetaUrl: string = import.meta.url
const require_ = createRequire(importMetaUrl)
import type { Plugin, ResolvedConfig, Rollup } from 'vite'
import { isUsingClientRouter } from '../extractExportNamesPlugin.js'
import { assertBuildInfo, type BuildInfo, getViteConfigRuntime } from '../../../runtime/globalContext.js'
import { getOutDirs } from '../../shared/getOutDirs.js'
type Bundle = Rollup.OutputBundle
type Options = Rollup.NormalizedOutputOptions
const ASSETS_MANIFEST = '__VITE_ASSETS_MANIFEST__'

function buildEntry(): Plugin[] {
  let config: ResolvedConfig
  return [
    {
      name: 'vike:buildEntry',
      enforce: 'post',
      async configResolved(config_) {
        config = config_
      }
    },
    ...serverProductionEntryPlugin({
      getServerProductionEntry: () => {
        return getServerProductionEntryCode(config)
      },
      libraryName: 'Vike'
    })
  ]
}

function getServerProductionEntryCode(config: ResolvedConfig): string {
  const importPath = getImportPath(config)
  const buildInfo: BuildInfo = {
    versionAtBuildTime: projectInfo.projectVersion,
    usesClientRouter: isUsingClientRouter(), // TODO/v1-release: remove
    viteConfigRuntime: getViteConfigRuntime(config)
  }
  assertBuildInfo(buildInfo)
  // After the old design is removed, let's maybe simplify and move everything into a single virtual module
  const importerCode = [
    `  import { setGlobalContext_buildEntry } from '${importPath}';`,
    `  import * as virtualFileExports from '${virtualFileIdImportUserCodeServer}';`,
    `  {`,
    // Because of a Rollup bug, we have to assign ASSETS_MANIFEST to a variable before passing it to setGlobalContext_buildEntry()
    // - This workaround doesn't work: https://github.com/vikejs/vike/commit/d5f3a4f7aae5a8bc44192e6cbb2bcb9007be188d
    `    const assetsManifest = ${ASSETS_MANIFEST};`,
    `    const buildInfo = ${JSON.stringify(buildInfo, null, 2)};`,
    '    setGlobalContext_buildEntry({',
    `      virtualFileExports,`,
    `      assetsManifest,`,
    `      buildInfo,`,
    '    });',
    `  }`,
    ''
  ].join('\n')
  return importerCode
}
/** Set the value of the ASSETS_MANIFEST constant inside dist/server/entry.js (or dist/server/index.js) */
async function set_ASSETS_MANIFEST(options: Options, bundle: Bundle, assetsJsonFilePath: string) {
  const { dir } = options
  assert(dir)
  const chunkPath = find_ASSETS_MANIFEST(bundle)
  const chunkFilePath = path.join(dir, chunkPath)
  const [assetsJsonString, chunkFileContent] = await Promise.all([
    await fs.readFile(assetsJsonFilePath, 'utf8'),
    await fs.readFile(chunkFilePath, 'utf8')
  ])
  const serverEntryFileContentPatched = chunkFileContent.replace(ASSETS_MANIFEST, assetsJsonString)
  assert(serverEntryFileContentPatched !== chunkFileContent)
  await fs.writeFile(chunkFilePath, serverEntryFileContentPatched)
}
function find_ASSETS_MANIFEST(bundle: Bundle): string {
  let chunkPath: string | undefined
  for (const filePath in bundle) {
    const chunk = bundle[filePath]!
    if ('code' in chunk && chunk.code.includes(ASSETS_MANIFEST)) {
      assert(!chunkPath)
      chunkPath = filePath
    }
  }
  assert(chunkPath)
  return chunkPath
}
function getImportPath(config: ResolvedConfig) {
  // We resolve filePathAbsolute even if we don't use it: we use require.resolve() as an assertion that the relative path is correct
  const filePathAbsolute = toPosixPath(
    // [RELATIVE_PATH_FROM_DIST] Current file: node_modules/vike/dist/esm/node/plugin/plugins/buildEntry/index.js
    require_.resolve(`../../../../../../dist/esm/__internal/index.js`)
  )
  if (
    // Let's implement a new config if a user needs the import to be a relative path instead of 'vike/__internal' (AFAIK a relative path is needed only if a framework has npm package 'vike' as direct dependency instead of a peer dependency and if the user of that framework uses pnpm)
    true as boolean
  ) {
    return 'vike/__internal'
  } else {
    const { outDirServer } = getOutDirs(config)
    const filePathRelative = path.posix.relative(outDirServer, filePathAbsolute)
    return filePathRelative
  }
}
