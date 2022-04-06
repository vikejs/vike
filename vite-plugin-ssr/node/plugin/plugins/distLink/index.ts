export { distLink }

import { writeFileSync } from 'fs'
import path from 'path'
import type { Plugin, ResolvedConfig } from 'vite'
import { assert, toPosixPath, isSSR_config, assertPosixPath, applyDev } from '../../utils'
const importerFile = require.resolve('./importer')

//*/
const DEBUG = true
/*/
const DEBUG = false
//*/

function distLinkReset() {
  if (DEBUG) {
    console.log('RESET')
  }
  writeFileSync(importerFile, `// Reset. I will be overwritten momentarily.`)
}

function distLink(): Plugin[] {
  let config: ResolvedConfig
  return [
    {
      name: 'vite-plugin-ssr:distLinkReset',
      apply: applyDev,
      configResolved() {
        distLinkReset()
      },
    },
    {
      name: 'vite-plugin-ssr:distLink',
      apply: 'build',
      configResolved(config_) {
        config = config_
        if (isSSR_config(config)) {
          distLinkReset()
        }
      },
      generateBundle() {
        if (!isSSR_config(config)) {
          return
        }
        const code = [
          '// Generated File.',
          "const { __internals: { setDistEntries } } = require('vite-plugin-ssr');",
          'setDistEntries({',
          "  pageFiles: () => import('./pageFiles.js'),",
          "  serverManifest: () => require('./manifest.json'),",
          "  clientManifest: () => require('../client/manifest.json'),",
          "  pluginManifest: () => require('../client/vite-plugin-ssr.json'),",
          '});',
          '',
        ].join('\n')
        if (DEBUG) {
          console.log('\nGEN\n')
          console.log(code)
        }
        const fileName = 'importBuild.js'
        this.emitFile({
          fileName,
          type: 'asset',
          source: code,
        })
        const importBuildFile = path.posix.join(getDistPath(config), 'server', fileName)
        writeFileSync(importerFile, `require('${importBuildFile}');\n`)
      },
    },
  ] as Plugin[]
}

function getDistPath(config: ResolvedConfig) {
  assert(isSSR_config(config))
  const {
    root,
    build: { outDir },
  } = config
  assert(root)
  assert(outDir.endsWith('/server'))
  assertPosixPath(root)
  const sourceDir = toPosixPath(__dirname + (() => '')()) // trick to avoid `@vercel/ncc` to glob import
  const rootRelative = path.posix.relative(sourceDir, root) // To `require()` an absolute path doesn't seem to work on Vercel
  const distPath = path.posix.join(rootRelative, path.posix.join(outDir, '..'))
  return distPath
}

/*
function isRunningWithYarnPnp() {
  try {
    require('pnpapi')
    return true
  } catch {
    return false
  }
}
*/
