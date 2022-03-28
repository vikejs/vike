export { distLink }

import { writeFileSync } from 'fs'
import path from 'path'
import type { Plugin } from 'vite'
import { assert, toPosixPath, isSSR_config, moduleExists, assertPosixPath } from '../../utils'

const { sourceDir, distEntriesFilePath } = getSourceDir()

function distLinkReset() {
  writeFileSync(distEntriesFilePath, ['exports.distEntries = null;', ''].join('\n'))
}

function distLink(): Plugin[] {
  let ssr: boolean
  let root: undefined | string
  let distServer: string
  return [
    {
      name: 'vite-plugin-ssr:distLinkReset',
      apply: 'serve',
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
        writeFileSync(
          distEntriesFilePath,
          [
            'exports.distEntries = {',
            `  pageFiles: () => import('${path.posix.join(distPath, '/server/pageFiles.js')}'),`,
            `  serverManifest: () => require('${path.posix.join(distPath, '/server/manifest.json')}'),`,
            `  clientManifest: () => require('${path.posix.join(distPath, '/client/manifest.json')}'),`,
            `  pluginManifest: () => require('${path.posix.join(distPath, '/client/vite-plugin-ssr.json')}'),`,
            '};',
            '',
          ].join('\n'),
        )
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
    // console.log({ sourceDir, root, distPath, rootRelative, distServer })
    return distPath
  }
}

function getSourceDir() {
  const sourceDir = toPosixPath(__dirname + (() => '')()) // trick to avoid `@vercel/ncc` to glob import
  const distEntriesFilePath = `${sourceDir}/distEntries.js`
  moduleExists(distEntriesFilePath)
  return { sourceDir, distEntriesFilePath }
}
