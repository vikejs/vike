export { getGlobRoots }

import { assertUsage, assertPosixPath, isNotNullish, isNpmPackageName, getDependencyRootDir } from '../../utils'
import path from 'path'
import type { ResolvedConfig } from 'vite'
import type { ConfigVpsResolved } from '../config/ConfigVps'

type GlobRoot = // TODO: refactor

    | {
        addFsAllowRoot: null
        addCrawlRoot: '/'
        addExtensionPageFileImport: null
      }
    | {
        addFsAllowRoot: string
        addCrawlRoot: null | string
        addExtensionPageFileImport: null
      }
    | {
        addFsAllowRoot: null
        addCrawlRoot: null
        addExtensionPageFileImport: string
      }

async function getGlobRoots(config: ResolvedConfig, configVps: ConfigVpsResolved): Promise<GlobRoot[]> {
  const { root } = config
  assertPosixPath(root)
  const globRoots: GlobRoot[] = [
    {
      addFsAllowRoot: null,
      addCrawlRoot: '/',
      addExtensionPageFileImport: null
    },
    ...(await Promise.all(configVps.pageFiles.include.map((pkgName) => processIncludeSrc(pkgName, root)))).filter(
      isNotNullish
    ),
    ...configVps.extensions
      .map(({ pageFilesResolved }) => pageFilesResolved)
      .flat()
      .map(({ importPath }) => ({
        addFsAllowRoot: null,
        addCrawlRoot: null,
        addExtensionPageFileImport: importPath
      }))
  ]
  return globRoots
}

async function processIncludeSrc(
  pkgName: string,
  root: string
): Promise<{ addFsAllowRoot: string; addCrawlRoot: string | null; addExtensionPageFileImport: null }> {
  assertUsage(
    isNpmPackageName(pkgName),
    `Wrong vite-plugin-ssr config \`pageFiles.include\`: the string \`${pkgName}\` is not a valid npm package name.`
  )
  const pkgRoot = getDependencyRootDir(pkgName)
  // return { addFsAllowRoot: pkgRoot, addCrawlRoot: pkgRoot, addExtensionPageFileImport: null }
  let pkgRootRelative = path.posix.relative(root, pkgRoot)
  if (!pkgRootRelative.startsWith('.')) {
    pkgRootRelative = './' + pkgRootRelative
  }
  return { addFsAllowRoot: pkgRoot, addCrawlRoot: pkgRootRelative, addExtensionPageFileImport: null }
}
