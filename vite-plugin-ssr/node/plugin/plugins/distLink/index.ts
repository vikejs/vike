export { distLink }

import { writeFileSync } from 'fs'
import path from 'path'
import type { Plugin } from 'vite'
import { assert, toPosixPath, isSSR_config, moduleExists, assertPosixPath, applyDev } from '../../utils'

const { sourceDir, distEntriesFilePath } = getSourceDir()

/*/
const DEBUG = true
/*/
const DEBUG = false
//*/

function distLinkReset() {
  const code = ['// Generated File.', '', 'exports.distEntries = null;', ''].join('\n')
  if (DEBUG) {
    console.log('RESET')
    console.log(code)
  }
  writeFileSync(distEntriesFilePath, code)
}

function distLink(): Plugin[] {
  let ssr: boolean
  let root: undefined | string
  let distServer: string
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
      configResolved(config) {
        ssr = isSSR_config(config)
        root = config.root ? toPosixPath(config.root) : toPosixPath(process.cwd())
        distServer = config.build.outDir
        assert(distServer)
        if (ssr) {
          distLinkReset()
        }
      },
      generateBundle() {
        assert(typeof ssr === 'boolean')
        if (!ssr) {
          return
        }
        const distPath = getDistPath()
        const code = [
          '// Generated File.',
          '',
          'exports.distEntries = {',
          `  pageFiles: () => import('${path.posix.join(distPath, '/server/pageFiles.js')}'),`,
          `  serverManifest: () => require('${path.posix.join(distPath, '/server/manifest.json')}'),`,
          `  clientManifest: () => require('${path.posix.join(distPath, '/client/manifest.json')}'),`,
          `  pluginManifest: () => require('${path.posix.join(distPath, '/client/vite-plugin-ssr.json')}'),`,
          '};',
          '',
        ].join('\n')
        if (DEBUG) {
          console.log('\nGEN\n')
          console.log(code)
        }
        writeFileSync(distEntriesFilePath, code)
      },
    },
  ] as Plugin[]

  function getDistPath() {
    assert(root)
    assert(distServer.endsWith('/server'))
    assertPosixPath(sourceDir)
    assertPosixPath(root)
    const rootRelative = path.posix.relative(sourceDir, root) // To `require()` an absolute path doesn't seem to work on Vercel
    const distPath = path.posix.join(rootRelative, path.posix.join(distServer, '..'))
    return distPath
  }
}

function getSourceDir() {
  const sourceDir = toPosixPath(__dirname + (() => '')()) // trick to avoid `@vercel/ncc` to glob import
  const distEntriesFilePath = `${sourceDir}/distEntries.js`
  moduleExists(distEntriesFilePath)
  return { sourceDir, distEntriesFilePath }
}
