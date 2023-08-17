export { resolveExtensions }

import type { ResolvedConfig } from 'vite'
import type { ConfigVpsUserProvided, ExtensionResolved } from '../../../../shared/ConfigVps.js'
import {
  assert,
  assertUsage,
  getNpmPackageName,
  toPosixPath,
  isNpmPackageName,
  getDependencyRootDir,
  assertPosixPath
} from '../../utils.js'
import path from 'path'
import fs from 'fs'
import { isValidFileType } from '../../../../shared/getPageFiles/fileTypes.js'
import { createRequire } from 'module'
// @ts-ignore Shimed by dist-cjs-fixup.js for CJS build.
const importMetaUrl: string = import.meta.url
const require_ = createRequire(importMetaUrl)

function resolveExtensions(configs: ConfigVpsUserProvided[], config: ResolvedConfig): ExtensionResolved[] {
  const extensions = configs.map((c) => c.extensions ?? []).flat()
  return extensions.map((extension) => {
    const { npmPackageName } = extension
    assertUsage(
      isNpmPackageName(npmPackageName),
      `vite-plugin-ssr extension '${npmPackageName}' doesn't seem to be a valid npm package name`
    )

    const npmPackageRootDir = getDependencyRootDir(npmPackageName, config.root)
    assertPosixPath(npmPackageRootDir)

    const pageConfigsDistFiles = resolvePageFilesDist(
      [
        ...(extension.pageConfigsDistFiles ?? []),
        // TODO/v1-release: remove
        ...(extension.pageFilesDist ?? [])
      ],
      npmPackageName,
      config,
      npmPackageRootDir
    )

    let pageConfigsSrcDirResolved: null | string = null
    {
      const pageConfigsSrcDir = extension.pageConfigsSrcDir ?? extension.pageFilesSrc
      if (pageConfigsSrcDir) {
        assertPathProvidedByUser('pageConfigsSrcDir', pageConfigsSrcDir, true)
        assert(pageConfigsSrcDir.endsWith('*'))
        pageConfigsSrcDirResolved = path.posix.join(npmPackageRootDir, pageConfigsSrcDir.slice(0, -1))
      }
    }
    assertUsage(
      pageConfigsSrcDirResolved || pageConfigsDistFiles,
      `Extension ${npmPackageName} should define either extension[number].pageConfigsDistFiles or extension[number].pageConfigsSrcDir`
    )
    assertUsage(
      !pageConfigsDistFiles || !pageConfigsSrcDirResolved,
      `Extension ${npmPackageName} shouldn't define extension[number].pageConfigsDistFiles as well extension[number].pageConfigsSrcDir, it should define only one instead`
    )

    const assetsDir = (() => {
      if (!extension.assetsDir) {
        return null
      }
      assertPathProvidedByUser('assetsDir', extension.assetsDir)
      assertPosixPath(extension.assetsDir)
      const assetsDir = path.posix.join(npmPackageRootDir, extension.assetsDir)
      return assetsDir
    })()
    assertUsage(
      !(assetsDir && pageConfigsSrcDirResolved),
      `Extension ${npmPackageName} shouldn't define both extension[number].pageConfigsSrcDir and extension[number].assetsDir`
    )

    const extensionResolved: ExtensionResolved = {
      npmPackageName,
      npmPackageRootDir,
      pageConfigsDistFiles,
      pageConfigsSrcDir: pageConfigsSrcDirResolved,
      assetsDir
    }
    return extensionResolved
  })
}

function assertPathProvidedByUser(pathName: 'assetsDir' | 'pageConfigsSrcDir', pathValue: string, starSuffix?: true) {
  const errMsg = `extension[number].${pathName} value '${pathValue}'`
  assertUsage(
    !pathValue.includes('\\'),
    `${errMsg} shouldn't contain any backward slahes '\' (replace them with forward slahes '/')`
  )
  assertUsage(!starSuffix || pathValue.endsWith('/*'), `${errMsg} should end with '/*'`)
  assertUsage(pathValue.startsWith('/'), `${errMsg} should start with '/'`)
}

function resolvePageFilesDist(
  pageConfigsDistFiles: undefined | string[],
  npmPackageName: string,
  config: ResolvedConfig,
  npmPackageRootDir: string
): null | NonNullable<ExtensionResolved['pageConfigsDistFiles']>[number][] {
  if (!pageConfigsDistFiles || pageConfigsDistFiles.length === 0) return null

  const pageConfigsDistFilesResolved: NonNullable<ExtensionResolved['pageConfigsDistFiles']>[number][] = []

  pageConfigsDistFiles.forEach((importPath) => {
    const errPrefix = `The page file '${importPath}' (provided in extensions[number].pageFiles) should`
    assertUsage(
      npmPackageName === getNpmPackageName(importPath),
      `${errPrefix} be a ${npmPackageName} module (e.g. '${npmPackageName}/renderer/_default.page.server.js')`
    )
    assertUsage(isValidFileType(importPath), `${errPrefix} end with '.js', '.js', '.cjs', or '.css'`)

    const filePath = resolveImportPath(importPath, npmPackageName, config, npmPackageRootDir)
    pageConfigsDistFilesResolved.push({
      importPath,
      filePath
    })

    const filePathCSS = getPathCSS(filePath)
    if (filePathCSS !== filePath && fs.existsSync(filePathCSS)) {
      const importPathCSS = getPathCSS(importPath)
      assertUsage(
        filePathCSS === resolveImportPath(importPathCSS, npmPackageName, config, npmPackageRootDir),
        `The entry package.json#exports["${importPathCSS}"] in the package.json of ${npmPackageName} (${npmPackageRootDir}/package.json) has a wrong value: make sure it resolves to ${filePathCSS}`
      )
      pageConfigsDistFilesResolved.push({
        importPath: importPathCSS,
        filePath: filePathCSS
      })
    }
  })

  return pageConfigsDistFilesResolved
}

function resolveImportPath(
  importPath: string,
  npmPackageName: string,
  config: ResolvedConfig,
  npmPackageRootDir: string
): string {
  let filePath: string
  try {
    filePath = require_.resolve(importPath, { paths: [config.root] })
  } catch (err: any) {
    if (err?.code === 'ERR_PACKAGE_PATH_NOT_EXPORTED') {
      assertUsage(
        false,
        `Define ${importPath} in the package.json#exports of ${npmPackageName} (${npmPackageRootDir}/package.json) with a Node.js export condition (even if it's a browser file such as CSS)`
      )
    }
    throw err
  }
  filePath = toPosixPath(filePath)
  return filePath
}

function getPathCSS(filePath: string): string {
  return filePath.split('.').slice(0, -1).join('.') + '.css'
}
