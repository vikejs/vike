export { resolveExtensions }

import type { ResolvedConfig } from 'vite'
import type { ConfigVpsUserProvided, ExtensionResolved } from './ConfigVps'
import {
  assert,
  assertUsage,
  getNpmPackageName,
  toPosixPath,
  isNpmPackageName,
  getDependencyRootDir,
  assertPosixPath
} from '../../utils'
import path from 'path'
import fs from 'fs'
import { isValidFileType } from '../../../../shared/getPageFiles/fileTypes'

function resolveExtensions(configs: ConfigVpsUserProvided[], config: ResolvedConfig): ExtensionResolved[] {
  const extensions = configs.map((c) => c.extensions ?? []).flat()
  return extensions.map((extension) => {
    const { npmPackageName } = extension
    assertUsage(
      isNpmPackageName(npmPackageName),
      `Extension '${npmPackageName}' doesn't seem to be a valid npm package name`
    )

    const npmPackageRootDir = getDependencyRootDir(npmPackageName, config.root)
    assertPosixPath(npmPackageRootDir)

    const pageFilesDist = resolvePageFilesDist(extension.pageFilesDist, npmPackageName, config, npmPackageRootDir)

    let pageFilesSrc: null | string = null
    if (extension.pageFilesSrc) {
      assertPathProvidedByUser('pageFilesSrc', extension.pageFilesSrc, true)
      assert(extension.pageFilesSrc.endsWith('*'))
      pageFilesSrc = path.posix.join(npmPackageRootDir, extension.pageFilesSrc.slice(0, -1))
    }
    assertUsage(
      (pageFilesSrc || pageFilesDist) && (!pageFilesDist || !pageFilesSrc),
      `Extension ${npmPackageName} should define either extension[number].pageFilesDist or extension[number].pageFilesSrc (at least one but not both)`
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
      !(assetsDir && pageFilesSrc),
      `Extension ${npmPackageName} shouldn't define both extension[number].pageFilesSrc and extension[number].assetsDir`
    )

    const extensionResolved: ExtensionResolved = {
      npmPackageName,
      npmPackageRootDir,
      pageFilesDist,
      pageFilesSrc,
      assetsDir
    }
    return extensionResolved
  })
}

function assertPathProvidedByUser(pathName: 'assetsDir' | 'pageFilesSrc', pathValue: string, starSuffix?: true) {
  const errMsg = `extension[number].${pathName} value '${pathValue}'`
  assertUsage(
    !pathValue.includes('\\'),
    `${errMsg} shouldn't contain any backward slahes '\' (replace them with forward slahes '/')`
  )
  assertUsage(!starSuffix || pathValue.endsWith('/*'), `${errMsg} should end with '/*'`)
  assertUsage(pathValue.startsWith('/'), `${errMsg} should start with '/'`)
}

function resolvePageFilesDist(
  pageFilesDist: undefined | string[],
  npmPackageName: string,
  config: ResolvedConfig,
  npmPackageRootDir: string
): null | NonNullable<ExtensionResolved['pageFilesDist']>[number][] {
  if (!pageFilesDist) return null

  const pageFilesDistResolved: NonNullable<ExtensionResolved['pageFilesDist']>[number][] = []

  pageFilesDist.forEach((importPath) => {
    const errPrefix = `The page file '${importPath}' (provided in extensions[number].pageFiles) should`
    assertUsage(
      npmPackageName === getNpmPackageName(importPath),
      `${errPrefix} be a ${npmPackageName} module (e.g. '${npmPackageName}/renderer/_default.page.server.js')`
    )
    assertUsage(isValidFileType(importPath), `${errPrefix} end with '.js', '.mjs', '.cjs', or '.css'`)

    const filePath = resolveImportPath(importPath, npmPackageName, config, npmPackageRootDir)
    pageFilesDistResolved.push({
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
      pageFilesDistResolved.push({
        importPath: importPathCSS,
        filePath: filePathCSS
      })
    }
  })

  return pageFilesDistResolved
}

function resolveImportPath(
  importPath: string,
  npmPackageName: string,
  config: ResolvedConfig,
  npmPackageRootDir: string
): string {
  let filePath: string
  try {
    filePath = require.resolve(importPath, { paths: [config.root] })
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
