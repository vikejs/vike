export { pluginDistFileNames }

// Attempt to preserve file structure of `.page.js` files:
//  - https://github.com/vikejs/vike/commit/11a4c49e5403aa7c37c8020c462b499425b41854
//  - Blocker: https://github.com/rollup/rollup/issues/4724

import { assertPosixPath, assert, assertUsage, isArray, isCallable } from '../../utils.js'
import path from 'node:path'
import crypto from 'node:crypto'
import type { Plugin, ResolvedConfig, Rollup } from 'vite'
import { getAssetsDir } from '../../shared/getAssetsDir.js'
import { assertModuleId, getModuleFilePathAbsolute } from '../../shared/getFilePath.js'
type PreRenderedChunk = Rollup.PreRenderedChunk
type PreRenderedAsset = Rollup.PreRenderedAsset

function pluginDistFileNames(): Plugin {
  return {
    name: 'vike:build:pluginDistFileNames',
    apply: 'build',
    enforce: 'post',
    configResolved(config) {
      // TODO/now remove
      // if (true as boolean) return

      const rollupOutputs = getRollupOutputs(config)
      // We need to support multiple outputs: @vite/plugin-legacy adds an output, see https://github.com/vikejs/vike/issues/477#issuecomment-1406434802
      rollupOutputs.forEach((rollupOutput) => {
        if (!('entryFileNames' in rollupOutput)) {
          rollupOutput.entryFileNames = (chunkInfo) => getEntryFileName(chunkInfo, config, true)
        }
        if (!('chunkFileNames' in rollupOutput)) {
          rollupOutput.chunkFileNames = (chunkInfo) => getChunkFileName(chunkInfo, config)
        }
        if (!('assetFileNames' in rollupOutput)) {
          rollupOutput.assetFileNames = (chunkInfo) => getAssetFileName(chunkInfo, config)

          // This Vite plugin is sometimes applied twice => avoid assertUsage() error below
          // - I don't know why this plugin can be applied twice for the same config. It happened when there was multiple Vike instances installed with one instance being a link to ~/code/vike/packages/vike/
          ;(rollupOutput.assetFileNames as any).isTheOneSetByVike = true
          assert((rollupOutput.assetFileNames as any).isTheOneSetByVike)
        } else {
          // If a user needs this:
          //  - assertUsage() that the naming provided by the user ends with `.[hash][extname]`
          //    - It's needed for getHash() of handleAssetsManifest()
          //    - Asset URLs should always contain a hash: it's paramount for caching assets.
          //    - If rollupOutput.assetFileNames is a function then use a wrapper function to apply the assertUsage()
          assertUsage(
            (rollupOutput.assetFileNames as any).isTheOneSetByVike,
            "Setting Vite's configuration build.rollupOptions.output.assetFileNames is currently forbidden. Reach out if you need to use it.",
          )
        }
        {
          const manualChunksOriginal = rollupOutput.manualChunks
          rollupOutput.manualChunks = function (id, ...args) {
            if (manualChunksOriginal) {
              if (isCallable(manualChunksOriginal)) {
                const result = manualChunksOriginal.call(this, id, ...args)
                if (result !== undefined) return result
              } else {
                assertUsage(
                  false,
                  "The Vite's configuration build.rollupOptions.output.manualChunks must be a function. Reach out if you need to set it to another value.",
                )
              }
            }

            // Disable CSS bundling to workaround https://github.com/vikejs/vike/issues/1815
            // TO-DO/eventually: let's bundle CSS again once Rolldown replaces Rollup
            if (id.endsWith('.css')) {
              const userRootDir = config.root
              if (id.startsWith(userRootDir)) {
                assertPosixPath(id)
                assertModuleId(id)

                let name: string
                const isNodeModules = id.match(/node_modules\/([^\/]+)\/(?!.*node_modules)/)
                if (isNodeModules) {
                  name = isNodeModules[1]!
                } else {
                  const filePath = getModuleFilePathAbsolute(id, config)
                  name = filePath
                  name = name.split('.').slice(0, -1).join('.') // remove file extension
                  name = name.split('/').filter(Boolean).join('_')
                }

                // Make fileHash the same between local development and CI
                const idStable = path.posix.relative(userRootDir, id)
                // Don't remove `?` queries because each `id` should belong to a unique bundle.
                const hash = getIdHash(idStable)

                return `${name}-${hash}`
              } else {
                let name: string
                const isVirtualModule = id.match(/virtual:([^:]+):/)
                if (isVirtualModule) {
                  name = isVirtualModule[1]!
                  assert(name)
                } else if (
                  // https://github.com/vikejs/vike/issues/1818#issuecomment-2298478321
                  id.startsWith('/__uno')
                ) {
                  name = 'uno'
                } else {
                  name = 'style'
                }
                const hash = getIdHash(id)
                return `${name}-${hash}`
              }
            }
          }
        }
      })
    },
  }
}

function getIdHash(id: string) {
  return crypto.createHash('md5').update(id).digest('hex').slice(0, 8)
}

function getAssetFileName(assetInfo: PreRenderedAsset, config: ResolvedConfig): string {
  const userRootDir = config.root
  const assetsDir = getAssetsDir(config)
  const dir = assetsDir + '/static'
  let { name } = assetInfo

  if (!name) {
    return `${dir}/[name].[hash][extname]`
  }

  // https://github.com/vikejs/vike/issues/794
  assertPosixPath(name)
  name = path.posix.basename(name)

  // dist/client/assets/index.page.server.jsx_extractAssets_lang.e4e33422.css
  // => dist/client/assets/index.page.server.e4e33422.css
  if (
    // Vite 2
    name?.endsWith('_extractAssets_lang.css') ||
    // Vite 3
    name?.endsWith('?extractAssets&lang.css')
  ) {
    name = name.split('.').slice(0, -2).join('.')
    name = clean(name, userRootDir)
    return `${dir}/${name}.[hash][extname]`
  }

  name = name.split('.').slice(0, -1).join('.')
  name = clean(name, userRootDir)
  return `${dir}/${name}.[hash][extname]`
}

function getChunkFileName(_chunkInfo: PreRenderedChunk, config: ResolvedConfig): string {
  const isForClientSide = !config.build.ssr
  let name = 'chunks/chunk-[hash].js'
  if (isForClientSide) {
    const assetsDir = getAssetsDir(config)
    name = `${assetsDir}/${name}`
  }
  return name
}

function getEntryFileName(chunkInfo: PreRenderedChunk, config: ResolvedConfig, isEntry: boolean): string {
  const userRootDir = config.root
  const assetsDir = getAssetsDir(config)
  const isForClientSide = !config.build.ssr

  let { name } = chunkInfo
  assertPosixPath(name)
  name = clean(
    name,
    userRootDir,
    true,
    // Not needed for client-side because dist/ filenames contain `.[hash].js`
    !isForClientSide,
  )

  if (isForClientSide) {
    return `${assetsDir}/${name}.[hash].js`
  } else {
    return `${name}.${isEntry ? 'mjs' : 'js'}`
  }
}

function removePathSeparators(name: string, userRootDir: string) {
  assertPosixPath(name)
  if (name.startsWith(userRootDir)) {
    name = name.slice(userRootDir.length)
    if (name.startsWith('/')) name = name.slice(1)
  }
  assert(!name.startsWith('/'), { name })

  const entryDir = 'entries/'
  const hasEntryDir = name.startsWith(entryDir)
  if (hasEntryDir) {
    name = name.slice(entryDir.length)
    assert(!name.startsWith('/'))
  }

  name = name.split('/').join('_')
  if (hasEntryDir) {
    name = `${entryDir}${name}`
  }

  return name
}

function clean(name: string, userRootDir: string, removePathSep?: boolean, fixGlob?: boolean): string {
  name = fixExtractAssetsQuery(name)
  if (fixGlob) {
    name = workaroundGlob(name)
  }
  name = replaceNonLatinCharacters(name)
  if (removePathSep) {
    name = removePathSeparators(name, userRootDir)
  }
  name = removeLeadingUnderscoreInFilename(name)
  name = removeUnderscoreDoublets(name)

  // Avoid:
  // ```
  // dist/client/assets/entries/.Dp9wM6PK.js
  // dist/server/entries/.mjs
  // ```
  assert(!name.endsWith('/'))

  return name
}
function fixExtractAssetsQuery(name: string): string {
  name = name.replace(/\.[^\.]*_extractAssets_lang$/, '.extractAssets')
  return name
}
function removeUnderscoreDoublets(name: string): string {
  name = name.split(/__+/).join('_')
  return name
}
function replaceNonLatinCharacters(name: string): string {
  name = name.split('+').join('')
  name = name.replace(/[^a-zA-Z0-9\/\._]/g, '-')
  return name
}
// Remove leading `_` from filename
//  - GitHub Pages treat URLs with filename starting with `_` differently (removing the need for workaround of creating a .jekyll file)
function removeLeadingUnderscoreInFilename(name: string): string {
  assertPosixPath(name)
  const paths = name.split('/')
  {
    const last = paths.length - 1
    let filename = paths[last]!
    if (filename.startsWith('_')) {
      filename = filename.slice(1)
      paths[last] = filename
      name = paths.join('/')
    }
  }
  return name
}

// Ensure import.meta.glob() doesn't match dist/ files
function workaroundGlob(name: string) {
  // V1 design
  name = name.split('+').join('')

  // TO-DO/next-major-release: remove
  // V0.4 design
  ;['client', 'server', 'route'].forEach((env) => {
    name = name.split(`.page.${env}`).join(`-page-${env}`)
  })
  name = name.split('.page.').join('-page.')
  name = name.replace(/\.page$/, '-page')
  return name
}

function getRollupOutputs(config: ResolvedConfig) {
  // @ts-expect-error is read-only
  config.build ??= {}
  config.build.rollupOptions ??= {}
  config.build.rollupOptions.output ??= {}
  const { output } = config.build.rollupOptions
  if (!isArray(output)) {
    return [output]
  }
  return output
}
