// Workaround for https://github.com/vitejs/vite/issues/2390

import {
  symlinkSync,
  mkdirSync,
  existsSync,
  unlinkSync,
  copyFileSync,
  mkdtempSync
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
import { tmpdir } from 'os'

export { workaroundViteIssue2390 }

function workaroundViteIssue2390(userRoot: string): void {
  if (!__dirname.includes('node_modules')) return
  assert(__dirname.endsWith('node_modules/vite-plugin-ssr/dist'))

  const pluginRoot = pathResolve(`${__dirname}/..`)
  const pluginDist = pluginRoot
  const pluginDistPristine = pathJoin(
    pathResolve(`${pluginRoot}/..`, 'vite-plugin-ssr-copy')
  )

  if (!existsSync(pluginDistPristine)) {
    mkdirSync(pluginDistPristine)
    copySync(pluginDist, pluginDistPristine)
  }

  const userDist = pathJoin(userRoot, 'dist')
  mkdirp(userDist)
  //const pluginDistUserland = pathJoin(userDist, 'vite-plugin-ssr')
  const pluginDistUserland = pathJoin(tmpdir(), 'vite-plugin-ssr')
  mkdirp(pluginDistUserland)
  //const pluginDistUserland = mkdtempSync(pathJoin(tmpdir(), 'vite-plugin-ssr_'))
  console.log(pluginDistUserland)

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

  symlinkSync(
    pathJoin(userRoot, 'node_modules'),
    pathJoin(pluginDistUserland, 'node_modules')
  )
}

//function getFilesToSymlink(pluginDistPristine: string): string[] {
//  const clientFiles = glob.sync('**/*', { cwd: pluginDistPristine })
//  return clientFiles
//}
function getFilesToSymlink(pluginDistPristine: string): string[] {
  const clientFiles = []
  clientFiles.push(
    ...glob.sync('**/*.client.ts', {
      cwd: pluginDistPristine,
      ignore: ['**/node_modules/**', '**/dist/**']
    })
  )
  clientFiles.push(
    ...glob.sync('**/*.shared.ts', {
      cwd: pluginDistPristine,
      ignore: ['**/node_modules/**', '**/dist/**']
    })
  )
  const clientEntry = pathJoin('client.ts')
  require.resolve(pathJoin(pluginDistPristine, clientEntry))
  clientFiles.push(clientEntry)

  const nodeFiles = []
  nodeFiles.push(
    ...glob.sync('dist/**/*.shared.js', {
      cwd: pluginDistPristine,
      ignore: ['**/node_modules/**']
    })
  )
  const nodeEntry = pathJoin('dist', 'user-files', 'infra.node.vite-entry.js')
  require.resolve(pathJoin(pluginDistPristine, nodeEntry))
  nodeFiles.push(nodeEntry)
  const packageJson = 'package.json'
  require.resolve(pathJoin(pluginDistPristine, packageJson))
  nodeFiles.push(packageJson)
  return [...clientFiles, ...nodeFiles]
}
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
