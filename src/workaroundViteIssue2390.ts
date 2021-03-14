// Workaround for https://github.com/vitejs/vite/issues/2390

import {
  symlinkSync,
  mkdirSync,
  existsSync,
  unlinkSync,
  copyFileSync
} from 'fs'
import { copySync, ensureFileSync } from 'fs-extra'
import {
  join as pathJoin,
  relative as pathRelative,
  resolve as pathResolve,
  dirname as pathDirname
} from 'path'
import { assert } from './utils'
import * as glob from 'fast-glob'

export { workaroundViteIssue2390 }

function workaroundViteIssue2390(userRoot: string): void {
  if (!__dirname.includes('node_modules')) return
  assert(__dirname.endsWith('node_modules/vite-plugin-ssr/dist'))

  const pluginRoot = pathResolve(`${__dirname}/..`)
  const pluginDist = pathJoin(pluginRoot, 'dist')
  const pluginDistPristine = pathJoin(pluginRoot, 'dist-copy')

  if (!existsSync(pluginDistPristine)) {
    mkdirSync(pluginDistPristine)
    copySync(pluginDist, pluginDistPristine)
  }

  const userDist = pathJoin(userRoot, 'dist')
  mkdirp(userDist)
  const pluginDistUserland = pathJoin(userDist, 'vite-plugin-ssr')
  mkdirp(pluginDistUserland)

  const filesToSymlink = getFilesToSymlink(pluginDistPristine)
  filesToSymlink.forEach((file) => {
    const source = pathJoin(pluginDist, file)
    const target = pathJoin(pluginDistUserland, file)
    const origin = pathJoin(pluginDistPristine, file)

    ensureFileSync(target)
    copyFileSync(origin, target)

    const targetRelative = pathRelative(pathDirname(source), target)

    // console.log(file, source, targetRelative)
    unlinkSync(source)
    symlinkSync(targetRelative, source)
  })
}

function getFilesToSymlink(pluginDistPristine: string): string[] {
  const clientFiles = glob.sync('**/*', { cwd: pluginDistPristine })
  return clientFiles
}
// function getFilesToSymlink(pluginDistPristine: string): string[] {
//   const clientFiles = glob.sync('**/*.client.js', { cwd: pluginDistPristine })
//   const sharedFiles = glob.sync('**/*.shared.js', { cwd: pluginDistPristine })
//   const nodeFiles = []
//   const clientEntry = 'client.js'
//   require.resolve(pathJoin(pluginDistPristine, clientEntry))
//   clientFiles.push(clientEntry)
//   const nodeEntry = pathJoin('user-files', 'infra.node.vite-entry.js')
//   require.resolve(pathJoin(pluginDistPristine, nodeEntry))
//   nodeFiles.push(nodeEntry)
//   return [...clientFiles, ...sharedFiles, ...nodeFiles]
// }
// function getFilesToSymlink(pluginDistPristine: string): string[] {
//   const clientFiles = glob.sync(`${pluginDistPristine}/**/*.client.js`)
//   const sharedFiles = glob.sync(`${pluginDistPristine}/**/*.shared.js`)
//   const nodeFiles = [require.resolve(pathJoin(pluginDistPristine, 'user-files', 'infra.node.vite-entry.js'))]
//   return [...clientFiles, ...sharedFiles, ...nodeFiles]
// }
// function getFilesToSymlink(pluginDist: string, pluginDistPristine: string): string[] {
//   const cwd = pluginDistPristine
//   const clientFiles = glob.sync('**/*.client.js', {cwd})
//   const sharedFiles = glob.sync('**/*.shared.js', {cwd})
//   const nodeFiles = [pathJoin('user-files', 'infra.node.vite-entry.js')]
//   return (
//     [...clientFiles, ...sharedFiles, ...nodeFiles]
//     .map(pathRelative => {
//       // ensure that file actually exits
//       require.resolve(pathJoin(pluginDistPristine, pathRelative))
//       return pathJoin(pluginDist, pathRelative)
//     })
//   )
// }

function mkdirp(dirPath: string) {
  try {
    mkdirSync(dirPath)
  } catch (_) {}
}
