export { resolveVpsConfig }

import type { Plugin, ResolvedConfig } from 'vite'
import type { ConfigVpsUserProvided, ConfigVpsResolved, ExtensionResolved } from './config/ConfigVps'
import { checkConfigVps } from './config/assertConfigVps'
import { assertUsage, getNpmPackageName, toPosixPath, isNpmPackageName, getDependencyRootDir } from '../utils'
import { findConfigVpsFromStemPackages } from './config/findConfigVpsFromStemPackages'
import path from 'path'
import { isValidFileType } from '../../../shared/getPageFiles/types'

function resolveVpsConfig(vpsConfig: unknown) {
  return {
    name: 'vite-plugin-ssr:resolveVpsConfig',
    enforce: 'pre',
    async configResolved(config) {
      const configVpsPromise = resolveConfigVps(
        (vpsConfig ?? {}) as ConfigVpsUserProvided,
        ((config as Record<string, unknown>).vitePluginSsr ?? {}) as ConfigVpsUserProvided,
        config
      )
      ;(config as Record<string, unknown>).configVpsPromise = configVpsPromise
    }
  } as Plugin
}

async function resolveConfigVps(
  fromPluginOptions: ConfigVpsUserProvided,
  fromViteConfig: ConfigVpsUserProvided,
  config: ResolvedConfig
): Promise<ConfigVpsResolved> {
  {
    const validationErr = checkConfigVps(fromPluginOptions)
    if (validationErr)
      assertUsage(false, `vite.config.js > vite-plugin-ssr option ${validationErr.prop} ${validationErr.errMsg}`)
  }
  {
    const validationErr = checkConfigVps(fromViteConfig)
    if (validationErr) assertUsage(false, `vite.config.js#vitePluginSsr.${validationErr.prop} ${validationErr.errMsg}`)
  }
  const fromStemPackages = await findConfigVpsFromStemPackages(config.root)
  const configs = [fromPluginOptions, ...fromStemPackages, fromViteConfig] // rename `configs` to `configsVpsUserProvided`

  const configVps: ConfigVpsResolved = {
    disableAutoFullBuild: pickFirst(configs.map((c) => c.disableAutoFullBuild)) ?? false,
    extensions: resolveExtensions(configs, config),
    prerender: resolvePrerenderOptions(configs),
    includeAssetsImportedByServer: pickFirst(configs.map((c) => c.includeAssetsImportedByServer)) ?? false
  }

  return configVps
}

function resolveExtensions(configs: ConfigVpsUserProvided[], config: ResolvedConfig): ExtensionResolved[] {
  // TODO: Move to own file
  const extensions = configs.map((c) => c.extensions ?? []).flat()
  return extensions.map((extension) => {
    const { npmPackageName, assetsManifest } = extension
    assertUsage(
      isNpmPackageName(npmPackageName),
      `VPS extension npm package '${npmPackageName}' doesn't seem to be a valid npm package name`
    )
    const npmPackageRootDir = getDependencyRootDir(npmPackageName)
    const pageFilesDist = !extension.pageFilesDist
      ? null
      : extension.pageFilesDist.map((importPath) => resolvePageFilesDist(importPath, npmPackageName, config))
    let pageFilesSrc: null | string = null
    if (extension.pageFilesSrc) {
      assertPathProvidedByUser('pageFilesSrc', extension.pageFilesSrc, true)
      pageFilesSrc = path.posix.join(npmPackageRootDir, extension.pageFilesSrc.slice(0, -1))
    }
    assertUsage(
      (pageFilesSrc || pageFilesDist) && (!pageFilesDist || !pageFilesSrc),
      `Extension ${npmPackageName} should define either extension[number].pageFiles or extension[number].pageFilesSrc (at least one but not both)`
    )
    const extensionResolved: ExtensionResolved = {
      npmPackageName,
      npmPackageRootDir,
      pageFilesDist,
      pageFilesSrc,
      assetsManifest: assetsManifest ?? null, // TODO: remove
      assetsDir: (() => {
        if (!extension.assetsDir) {
          return null
        }
        assertPathProvidedByUser('assetsDir', extension.assetsDir)
        const assetsDir = path.posix.join(npmPackageRootDir, toPosixPath(extension.assetsDir))
        return assetsDir
      })()
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
  importPath: string,
  npmPackageName: string,
  config: ResolvedConfig
): NonNullable<ExtensionResolved['pageFilesDist']>[number] {
  const errPrefix = `The page file '${importPath}' (provided in extensions[number].pageFiles) should`
  assertUsage(
    npmPackageName === getNpmPackageName(importPath),
    `${errPrefix} be a ${npmPackageName} module (e.g. '${npmPackageName}/renderer/_default.page.server.js')`
  )
  assertUsage(isValidFileType(importPath), `${errPrefix} should end with '.js', '.mjs', '.cjs', or '.css'`)
  let filePath: string
  try {
    filePath = require.resolve(importPath, { paths: [config.root] })
  } catch (err: any) {
    if (err?.code === 'ERR_PACKAGE_PATH_NOT_EXPORTED') {
      assertUsage(
        false,
        `Define ${importPath} in the package.json#exports of ${npmPackageName} with a Node.js export condition (even if it's a browser file like CSS).`
      )
    }
    throw err
  }
  return {
    importPath,
    filePath
  }
}

function resolvePrerenderOptions(configs: ConfigVpsUserProvided[]): ConfigVpsResolved['prerender'] {
  if (!configs.some((c) => c.prerender)) {
    return false
  }
  const configsPrerender = configs.map((c) => c.prerender).filter(isObject)
  return {
    partial: pickFirst(configsPrerender.map((c) => c.partial)) ?? false,
    noExtraDir: pickFirst(configsPrerender.map((c) => c.noExtraDir)) ?? false,
    parallel: pickFirst(configsPrerender.map((c) => c.parallel)) ?? true,
    disableAutoRun: pickFirst(configsPrerender.map((c) => c.disableAutoRun)) ?? false
  }
}

function pickFirst<T>(arr: T[]): T | undefined {
  return arr.filter((v) => v !== undefined)[0]
}

function isObject<T>(p: T | boolean | undefined): p is T {
  return typeof p === 'object'
}
