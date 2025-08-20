export { requireResolveOptional }
export { requireResolveOptionalDir }
export { requireResolveNpmPackage }
export { requireResolveVikeDistFile }
export { getPackageNodeModulesDirectory }

import { assert } from './assert.js'
import { assertIsNotBrowser } from './assertIsNotBrowser.js'
import { assertIsNotProductionRuntime } from './assertSetup.js'
import { assertPosixPath, toPosixPath } from './path.js'
import { scriptFileExtensionList } from './isScriptFile.js'
import { createRequire } from 'node:module'
import path from 'node:path'
import { assertIsImportPathNpmPackage, isImportPathNpmPackageOrPathAlias } from './parseNpmPackage.js'
import { isNotNullish } from './isNullish.js'
import { createDebugger } from './debug.js'
// @ts-ignore import.meta.url is shimmed at dist/cjs by dist-cjs-fixup.js.
const importMetaUrl: string = import.meta.url
assertPosixPath(importMetaUrl)

assertIsNotBrowser()
assertIsNotProductionRuntime()

const debug = createDebugger('vike:resolve')

// - We still can't use import.meta.resolve() as of 23.1.0 (November 2024) because `parent` argument requires an experimental flag.
//   - https://stackoverflow.com/questions/54977743/do-require-resolve-for-es-modules#comment139581675_62272600
// - Passing context to createRequire(context) isn't equivalent to passing it to the `paths` argument of require.resolve()
//   - https://github.com/brillout/require-test
//   - In practice, I guess it doesn't make a difference? It just seems to be small Node.js weirdness.
// - The argument createRequire(argument) seems to be overridden by the `paths` argument require.resolve()
//   - For example, passing an empty array to `paths` kills the argument passed to `createRequire()`
//   - Thus, when `paths` is defined, then the context needs to be passed to both createRequire() as well as the `paths` argument of require.resolve()

function requireResolve_(
  importPath: string,
  importerFilePath: string | null,
  userRootDir: string | null,
  doNotHandleFileExtension: boolean = false,
) {
  assertPosixPath(importPath)

  const contexts = importerFilePath
    ? [importerFilePath]
    : [userRootDir ? getFakeImporterFile(userRootDir) : importMetaUrl]
  addExtraContextForNpmPackageImport(contexts, importPath, userRootDir)

  let importPathResolvedFilePath: string | undefined
  let failure: undefined | { err: unknown }
  for (const context of contexts) {
    assertPosixPath(context)
    const contextNode = makeNodeFriendly(ensureFilePrefix(context))
    let importPathNode = makeNodeFriendly(importPath)

    const require_ = createRequire(contextNode)

    if (!doNotHandleFileExtension) {
      addFileExtensionsToRequireResolve(require_)
      importPathNode = removeFileExtension(importPathNode)
    }

    try {
      importPathResolvedFilePath = require_.resolve(importPathNode)
    } catch (err) {
      if (debug.isActivated) {
        const stack = new Error().stack
        debug('ERROR', { err, importPath, context }, stack)
      }
      failure ??= { err }
    }

    if (importPathResolvedFilePath) break
  }

  if (!importPathResolvedFilePath) {
    assert(failure)
    if (debug.isActivated) {
      debug('FAILURE', {
        importPath,
        importerFilePath,
        userRootDir,
        doNotHandleFileExtension,
        importMetaUrl,
        contexts,
      })
    }
    return { importPathResolvedFilePath: undefined, err: failure.err, hasFailed: true as const }
  } else {
    if (failure && debug.isActivated) {
      debug('SUCCESS', {
        importPath,
        contexts,
      })
    }
    assert(importPathResolvedFilePath)
    importPathResolvedFilePath = toPosixPath(importPathResolvedFilePath)
    return { importPathResolvedFilePath, err: undefined, hasFailed: false as const }
  }
}
function requireResolveOptional({
  importPath,
  importerFilePath,
  userRootDir,
}: { importPath: string; importerFilePath: string; userRootDir: string }): string | null {
  const res = requireResolve_(importPath, importerFilePath, userRootDir)
  if (res.hasFailed) return null
  return res.importPathResolvedFilePath
}
function requireResolveOptionalDir({
  importPath,
  importerDir,
  userRootDir,
}: { importPath: string; importerDir: string; userRootDir: string }): string | null {
  const importerFilePath = getFakeImporterFile(importerDir)
  const res = requireResolve_(importPath, importerFilePath, userRootDir)
  if (res.hasFailed) return null
  return res.importPathResolvedFilePath
}
function requireResolveNpmPackage({
  importPathNpmPackage,
  userRootDir,
}: { importPathNpmPackage: string; userRootDir: string }): string {
  assertIsImportPathNpmPackage(importPathNpmPackage)
  const importerFilePath = getFakeImporterFile(userRootDir)
  const res = requireResolve_(importPathNpmPackage, importerFilePath, userRootDir)
  if (res.hasFailed) throw res.err
  return res.importPathResolvedFilePath
}
function requireResolveVikeDistFile(distFile: `dist/esm/${string}`) {
  const vikeNodeModulesRoot = getPackageNodeModulesDirectory()
  assertPosixPath(vikeNodeModulesRoot)
  assertPosixPath(distFile)
  const importPathResolvedFilePath = makeNodeFriendly(path.posix.join(vikeNodeModulesRoot, distFile))

  // Double check
  {
    const res = requireResolve_(
      importPathResolvedFilePath,
      // No context needed: importPathResolvedFilePath is already resolved and absolute
      null,
      null,
      true,
    )
    if (res.hasFailed) throw res.err
    assert(res.importPathResolvedFilePath === importPathResolvedFilePath)
  }

  return importPathResolvedFilePath
}

function addExtraContextForNpmPackageImport(contexts: string[], importPath: string, userRootDir: string | null) {
  // We should add extra context only for npm packages, but unfortunately we cannot always disambiguate between npm package imports and path aliases.
  if (!isImportPathNpmPackageOrPathAlias(importPath)) return

  const userRootDirFakeFile = userRootDir && getFakeImporterFile(userRootDir)
  ;[
    // Workaround for monorepo resolve issue: https://github.com/vikejs/vike-react/pull/161/commits/dbaa6643e78015ac2797c237552800fef29b72a7
    userRootDirFakeFile,
    // I can't think of a use case where this would be needed, but let's add one extra last chance to successfully resolve some complex monorepo setups
    importMetaUrl,
  ]
    .filter(isNotNullish)
    .forEach((context) => {
      const alreadyHasContext = contexts.includes(context) || contexts.includes(ensureFilePrefix(context))
      if (alreadyHasContext) return
      contexts.push(context)
    })
}

function removeFileExtension(importPath: string) {
  // Skip for Bun: https://github.com/vikejs/vike/issues/2204
  //@ts-ignore
  if (typeof Bun !== 'undefined') {
    // https://bun.sh/guides/util/detect-bun
    assert(process.versions.bun)
    return importPath
  }

  for (const ext of scriptFileExtensionList) {
    const suffix = `.${ext}`
    if (importPath.endsWith(suffix)) {
      return importPath.slice(0, -1 * suffix.length)
    }
  }
  return importPath
}
function addFileExtensionsToRequireResolve(require_: NodeJS.Require) {
  const added: string[] = []
  scriptFileExtensionList.forEach((ext: string) => {
    assert(!ext.includes('.'))
    ext = `.${ext}`
    if (!require_.extensions[ext]) {
      require_.extensions[ext] = require_.extensions['.js']
      added.push(ext)
    }
  })
}

function getPackageNodeModulesDirectory() {
  // [RELATIVE_PATH_FROM_DIST] Current file: node_modules/${packageName}/dist/esm/utils/requireResolve.js
  assert(importMetaUrl.includes('/dist/esm/') || importMetaUrl.includes('/dist/cjs/'))
  const packageNodeModulesDirectory = path.posix.join(removeFilePrefix(path.dirname(importMetaUrl)), '../../../')
  // Return `node_modules/${packageName}/`
  return packageNodeModulesDirectory
}

function getFakeImporterFile(dirPath: string) {
  assertPosixPath(dirPath)
  assert(!dirPath.startsWith('file')) // The file:// prefix is bogus when used with path.posix.join()
  const importerFilePath = path.posix.join(dirPath, 'fakeFileForNodeResolve.js')
  return importerFilePath
}

function ensureFilePrefix(filePath: string) {
  assertPosixPath(filePath)
  const filePrefix = getFilePrefix()
  if (!filePath.startsWith(filePrefix)) {
    assert(!filePath.startsWith('file'))
    filePath = filePrefix + filePath
  }
  assert(filePath.startsWith(filePrefix))
  return filePath
}
function removeFilePrefix(filePath: string) {
  const filePrefix = getFilePrefix()
  if (filePath.startsWith(filePrefix)) {
    filePath = filePath.slice(filePrefix.length)
  }
  assert(!filePath.startsWith('file'))
  return filePath
}
function getFilePrefix() {
  let prefix = 'file://'
  if (process.platform === 'win32') prefix += '/'
  return prefix
}

function makeNodeFriendly(filePath: string) {
  // https://github.com/vikejs/vike/issues/2436#issuecomment-2849145340
  return decodeURIComponent(filePath)
}
