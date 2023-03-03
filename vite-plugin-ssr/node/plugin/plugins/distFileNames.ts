export { distFileNames }

// Attempt to preserve file structure of `.page.js` files:
//  - https://github.com/brillout/vite-plugin-ssr/commit/11a4c49e5403aa7c37c8020c462b499425b41854
//  - Blocker: https://github.com/rollup/rollup/issues/4724

import { assertPosixPath, assert, assertUsage, removeFileExtention } from '../utils'
import type { Plugin, ResolvedConfig } from 'vite'
import path from 'path'
import { extractAssetsRE } from './extractAssetsPlugin'
import { isVirutalModulePageCodeFilesImporter } from '../../commons/virtualIdPageCodeFilesImporter'

// Same as `import type { PreRenderedChunk, PreRenderedAsset } from 'rollup'` but safe when Vite updates Rollup version
type Output = Extract<ResolvedConfig['build']['rollupOptions']['output'], { chunkFileNames?: unknown }>
type PreRenderedChunk = Parameters<Extract<Output['chunkFileNames'], Function>>[0]
type PreRenderedAsset = Parameters<Extract<Output['assetFileNames'], Function>>[0]

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

  // dist/client/assets/index.page.server.jsx_extractAssets_lang.e4e33422.css
  // => dist/client/assets/index.page.server.e4e33422.css
  if (
    // Vite 2
    name?.endsWith('_extractAssets_lang.css') ||
    // Vite 3
    name?.endsWith('?extractAssets&lang.css')
  ) {
    name = name.split('.').slice(0, -2).join('.')
    return `${dir}/${name}.[hash][extname]`
  }

  name = removeLeadingHash(name)
  name = name.split('.').slice(0, -1).join('.')
  return `${dir}/${name}.[hash][extname]`
}

function getScriptFileName(chunkInfo: PreRenderedChunk, config: ResolvedConfig, isEntry: boolean): string {
  const { root } = config
  const assetsDir = getAssetsDir(config)

  assertPosixPath(root)
  const id = chunkInfo.facadeModuleId
  if (id) assertPosixPath(id)

  let name: string | undefined
  if (id) {
    const result = isVirutalModulePageCodeFilesImporter(id)
    if (result) {
      const { pageId } = result
      pageId.startsWith('/')
      name = pageId.slice(1)
    }
  }

  {
    const chunkName = config.build.ssr ? `chunks/[hash].js` : `${assetsDir}/chunks/[hash].js`
    if (!name && !isEntry) {
      if (!id || id.includes('/node_modules/') || extractAssetsRE.test(id) || !id.startsWith(config.root)) {
        return chunkName
      }
    }
  }

  if (id && id.startsWith(config.root)) {
    let scriptPath = path.posix.relative(root, id)
    assert(!scriptPath.startsWith('.'))
    assert(!scriptPath.startsWith('/'))
    scriptPath = removeFileExtention(scriptPath)
    name = scriptPath
  }

  if (!name) {
    name = chunkInfo.name
  }

  if (!config.build.ssr) {
    return `${assetsDir}/${name}.[hash].js`
  } else {
    name = workaroundGlob(name)
    return `${name}.${isEntry ? 'mjs' : 'js'}`
  }
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

function removeLeadingHash(name: string): string {
  assert(!name.includes('\\'))
  const paths = name.split('/')
  const last = paths.length - 1
  const file = paths[last]!
  if (!file.startsWith('_') || file.startsWith('_default.page.') || file.startsWith('_error.page.')) {
    return name
  } else {
    paths[last] = paths[last]!.slice(1)
    return paths.join('/')
  }
}
