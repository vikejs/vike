export { getGlobRoots }

import fs from 'fs'
import { assertUsage, assertPosixPath, toPosixPath, assert, isNotNullish, isNpmPackageName } from '../../utils'
import path from 'path'
import symlinkDir from 'symlink-dir'
import resolve from 'resolve'
import type { ResolvedConfig } from 'vite'
import type { ConfigVpsResolved } from '../config/ConfigVps'

type GlobRoot =
  | {
      addFsAllowRoot: null
      addCrawlRoot: '/'
      addPageFile: null
    }
  | {
      addFsAllowRoot: string
      addCrawlRoot: null | string
      addPageFile: null
    }
  | {
      addFsAllowRoot: null
      addCrawlRoot: null
      addPageFile: string
    }

async function getGlobRoots(config: ResolvedConfig, configVps: ConfigVpsResolved): Promise<GlobRoot[]> {
  const { root } = config
  assertPosixPath(root)
  const globRoots: GlobRoot[] = [
    {
      addFsAllowRoot: null,
      addCrawlRoot: '/',
      addPageFile: null
    },
    ...(await Promise.all(configVps.pageFiles.include.map((pkgName) => processIncludeSrc(pkgName, root)))).filter(
      isNotNullish
    ),
    ...configVps.pageFiles.addPageFiles.map((includeDistEntry) => ({
      addFsAllowRoot: null,
      addCrawlRoot: null,
      addPageFile: includeDistEntry
    }))
  ]
  return globRoots
}

async function processIncludeSrc(
  pkgName: string,
  root: string
): Promise<{ addFsAllowRoot: string; addCrawlRoot: string | null; addPageFile: null }> {
  assertUsage(
    isNpmPackageName(pkgName),
    `Wrong vite-plugin-ssr config \`pageFiles.include\`: the string \`${pkgName}\` is not a valid npm package name.`
  )
  const { pkgJson, pkgRoot } = resolvePackage(pkgName, { preserveSymlinks: true, root })
  const pageFilesDir = pkgJson['vite-plugin-ssr']?.pageFilesDir ?? ''
  assertUsage(
    !pageFilesDir,
    'package.json#vite-plugin-ssr.pageFilesDir is deprecated. Reach out to a vite-plugin-ssr maintainer.'
  )
  const addFsAllowRoot = resolvePackageRoot(pkgName, { preserveSymlinks: false, root })

  {
    assertPosixPath(root)
    assertPosixPath(addFsAllowRoot)
    const appRootIncludedInPkgRoot = root.startsWith(addFsAllowRoot)
    if (appRootIncludedInPkgRoot) {
      return { addFsAllowRoot, addCrawlRoot: null, addPageFile: null }
    }
  }

  const crawlRoot = path.posix.join(addFsAllowRoot, pageFilesDir)
  assertUsage(
    !root.startsWith(crawlRoot),
    `The page files include path ${crawlRoot} is a parent of the app's root ${root}. You need to use/change the \`pageFilesDir\` options. Contact the vite-plugin-ssr maintainer on GitHub / Discord for more information.`
  )

  const pkgRootRelative = path.posix.relative(root, pkgRoot)
  if (!pkgRootRelative.startsWith('..')) {
    const addCrawlRoot = path.posix.join(pkgRootRelative, pageFilesDir)
    return { addFsAllowRoot, addCrawlRoot, addPageFile: null }
  }

  const addCrawlRoot = path.posix.join('node_modules', '.vite-plugin-ssr', pkgName, pageFilesDir)
  if (!fs.existsSync(addCrawlRoot)) {
    const sourceAbsolute = crawlRoot
    const targetAbsolute = `${root}/${addCrawlRoot}`
    assert(!root.startsWith(crawlRoot)) // See above
    assert(!targetAbsolute.startsWith(sourceAbsolute)) // Ensure it's not a cyclic symlink
    const source = path.posix.relative(root, sourceAbsolute)
    const target = path.posix.relative(root, targetAbsolute)
    await symlinkDir(source, target)
  }
  return { addFsAllowRoot, addCrawlRoot, addPageFile: null }
}

function resolvePackage(pkgName: string, options: ResolveOptions) {
  const pkgJsonPath = resolvePackageJson(pkgName, options)
  const pkgRoot = path.posix.dirname(pkgJsonPath)
  const pkgJson: { ['vite-plugin-ssr']?: { pageFilesDir?: string } } = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'))
  return { pkgJson, pkgRoot }
}
function resolvePackageRoot(pkgName: string, options: ResolveOptions) {
  const pkgJsonPath = resolvePackageJson(pkgName, options)
  const pkgRoot = path.posix.dirname(pkgJsonPath)
  return pkgRoot
}
type ResolveOptions = { preserveSymlinks: boolean; root: string }
function resolvePackageJson(pkgName: string, { preserveSymlinks, root }: ResolveOptions) {
  let pkgJsonPath: string
  try {
    // We cannot use Node.js's `require.resolve()`: https://stackoverflow.com/questions/10111163/in-node-js-how-can-i-get-the-path-of-a-module-i-have-loaded-via-require-that-is/63441056#63441056
    pkgJsonPath = resolve.sync(`${pkgName}/package.json`, { preserveSymlinks, basedir: root })
  } catch (_err) {
    assertUsage(false, `Cannot find \`${pkgName}\`. Did you install it?`)
  }
  pkgJsonPath = toPosixPath(pkgJsonPath)
  return pkgJsonPath
}
