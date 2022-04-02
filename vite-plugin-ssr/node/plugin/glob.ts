export { resolveGlobConfig }
export { getGlobPath }

import fs from 'fs'
import { assertPosixPath, assertUsage, toPosixPath } from './utils'
import path from 'path'
import symlinkDir from 'symlink-dir'
import resolve from 'resolve'

function resolveGlobConfig(includePageFiles: string[]) {
  let globPaths: string[]
  return getGlobRoots
  async function getGlobRoots(root: string) {
    root = toPosixPath(root)
    if (!globPaths) {
      const entriesDefault = ['/']
      const entriesInclude = await Promise.all(includePageFiles.map((pkgName) => createIncludePath(pkgName, root)))
      globPaths = [...entriesDefault, ...entriesInclude]
    }
    return globPaths
  }
}

async function createIncludePath(pkgName: string, root: string): Promise<string> {
  assertUsage(
    isNpmName(pkgName),
    `Wrong vite-plugin-ssr config \`pageFiles.include\`: it contains \`${pkgName}\` which is not a valid npm package name.`,
  )
  let pkgJsonPath: string
  try {
    // We cannot use Node.js's `require.resolve()`: https://stackoverflow.com/questions/10111163/in-node-js-how-can-i-get-the-path-of-a-module-i-have-loaded-via-require-that-is/63441056#63441056
    pkgJsonPath = resolve.sync(`${pkgName}/package.json`, { preserveSymlinks: true, basedir: root })
  } catch (err) {
    assertUsage(false, `Cannot find \`${pkgName}\`. Did you install it?`)
  }
  pkgJsonPath = toPosixPath(pkgJsonPath)
  // const pkgJson: { ['vite-plugin-ssr']?: { pageFilesDir?: string } } = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'))
  const pkgRoot = path.posix.dirname(pkgJsonPath)
  // let pageFilesDir = pkgJson['vite-plugin-ssr']?.pageFilesDir ?? ''
  const pageFilesDir = ''
  const pkgPathRelative = path.posix.relative(root, pkgRoot)
  if (!pkgPathRelative.startsWith('.')) {
    const includePath = path.posix.join(pkgPathRelative, pageFilesDir)
    assertPosixPath(includePath)
    return includePath
  }
  const includePath = path.posix.join('node_modules', pkgName, pageFilesDir)
  if (!fs.existsSync(includePath)) {
    // const cwd = toPosixPath(process.cwd())
    const cwd = root
    const source = path.posix.relative(cwd, pkgRoot)
    const target = path.posix.relative(cwd, `${root}/${includePath}`)
    assertUsage(
      !target.startsWith(source),
      'Your file structure is not supported. Contact the vite-plugin-ssr maintainer on GitHub / Discord.',
    )
    await symlinkDir(source, target)
  }
  assertPosixPath(includePath)
  return includePath
}

function isNpmName(str: string) {
  if (str.includes('\\')) {
    return false
  }
  if (!str.includes('/')) {
    return true
  }
  if (str.split('/').length === 2 && str.startsWith('@')) {
    return true
  }
  return false
}

function getGlobPath(
  globRoot: string,
  fileSuffix: 'page' | 'page.client' | 'page.server' | 'page.route',
  root?: string,
): string {
  // Vite uses `fast-glob` which resolves globs with micromatch: https://github.com/micromatch/micromatch
  // Pattern `*([a-zA-Z0-9])` is an Extglob: https://github.com/micromatch/micromatch#extglobs
  const fileExtention = '*([a-zA-Z0-9])'
  assertPosixPath(globRoot)
  let globPath = [...globRoot.split('/'), '**', `*.${fileSuffix}.${fileExtention}`].filter(Boolean).join('/')
  if (root) {
    globPath = toPosixPath(path.posix.join(root, globPath))
  } else {
    globPath = '/' + globPath
  }
  return globPath
}
