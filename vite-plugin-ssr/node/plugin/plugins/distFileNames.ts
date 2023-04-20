export { distFileNames }

// Attempt to preserve file structure of `.page.js` files:
//  - https://github.com/brillout/vite-plugin-ssr/commit/11a4c49e5403aa7c37c8020c462b499425b41854
//  - Blocker: https://github.com/rollup/rollup/issues/4724

import { assertPosixPath, assert, assertUsage, removeFileExtention, toPosixPath } from '../utils'
import path from 'path'
import { extractAssetsRE } from './extractAssetsPlugin'
import { isVirtualFileIdImportPageCode } from '../../shared/virtual-files/virtualFileImportPageCode'
import type { Plugin, ResolvedConfig, Rollup } from 'vite'
type PreRenderedChunk = Rollup.PreRenderedChunk
type PreRenderedAsset = Rollup.PreRenderedAsset

function distFileNames(): Plugin {
  return {
    name: 'vite-plugin-ssr:distFileNames',
    apply: 'build',
    enforce: 'post',
    configResolved(config) {
      const rollupOutputs = getRollupOutputs(config)
      // We need to support multiple outputs: @vite/plugin-legacy adds an ouput, see https://github.com/brillout/vite-plugin-ssr/issues/477#issuecomment-1406434802
      rollupOutputs.forEach((rollupOutput) => {
        if (!rollupOutput.entryFileNames) {
          rollupOutput.entryFileNames = (chunkInfo) => getScriptFileName(chunkInfo, config, true)
        }
        if (!rollupOutput.chunkFileNames) {
          rollupOutput.chunkFileNames = (chunkInfo) => getScriptFileName(chunkInfo, config, false)
        }
        if (!rollupOutput.assetFileNames) {
          rollupOutput.assetFileNames = (chunkInfo) => getAssetFileName(chunkInfo, config)
        }
      })
    }
  }
}

function getAssetFileName(assetInfo: PreRenderedAsset, config: ResolvedConfig): string {
  const assetsDir = getAssetsDir(config)
  const dir = assetsDir + '/static'
  let { name } = assetInfo

  if (!name) {
    return `${dir}/[name].[hash][extname]`
  }

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
    name = removeSpecialCharacters(name)
    return `${dir}/${name}.[hash][extname]`
  }

  name = name.split('.').slice(0, -1).join('.')
  name = removeSpecialCharacters(name)
  return `${dir}/${name}.[hash][extname]`
}

function getScriptFileName(chunkInfo: PreRenderedChunk, config: ResolvedConfig, isEntry: boolean): string {
  const { root } = config
  const assetsDir = getAssetsDir(config)

  assertPosixPath(root)
  let id = chunkInfo.facadeModuleId
  // I don't know why, but chunkInfo.facadeModuleId isn't always a posix path, see https://github.com/brillout/vite-plugin-ssr/issues/771
  if (id) id = toPosixPath(id)

  let name: string
  if (isEntry) {
    name = chunkInfo.name
  } else {
    const isNodeModules = id?.includes('/node_modules/')
    if (!id || isNodeModules || extractAssetsRE.test(id) || !id.startsWith(config.root)) {
      return config.build.ssr ? `chunks/[hash].js` : `${assetsDir}/chunks/[hash].js`
    } else {
      const virtualFile = isVirtualFileIdImportPageCode(id)
      if (virtualFile) {
        const { pageId } = virtualFile
        assert(pageId.startsWith('/'))
        name = pageId.slice(1)
      } else {
        assert(id.startsWith(config.root) && !isNodeModules)
        let scriptPath = path.posix.relative(root, id)
        assert(!scriptPath.startsWith('.'))
        assert(!scriptPath.startsWith('/'))
        scriptPath = removeFileExtention(scriptPath)
        name = scriptPath
      }
    }
  }

  if (!config.build.ssr) {
    name = removeSpecialCharacters(name)
    return `${assetsDir}/${name}.[hash].js`
  } else {
    name = workaroundGlob(name)
    name = removeSpecialCharacters(name)
    return `${name}.${isEntry ? 'mjs' : 'js'}`
  }
}

function removeSpecialCharacters(name: string): string {
  name = name.split('+').join('')
  // GitHub Pages treat URLs with filename starting with `_` differently (removing the need for workaround of creating a .jekyll file)
  name = name.split('_').join('')
  return name
}

// Ensure import.meta.glob() doesn't match dist/ files
function workaroundGlob(name: string) {
  // V1 design
  name = name.split('+').join('')

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
  if (!Array.isArray(output)) {
    return [output]
  }
  return output
}

function getAssetsDir(config: ResolvedConfig) {
  let { assetsDir } = config.build
  assertUsage(assetsDir, `${assetsDir} cannot be an empty string`)
  assetsDir = assetsDir.split(/\/|\\/).filter(Boolean).join('/')
  return assetsDir
}
