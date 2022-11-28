export { resolveVpsConfig }

import type { Plugin, ResolvedConfig } from 'vite'
import type { ConfigVpsUserProvided, ConfigVpsResolved } from './config/ConfigVps'
import { checkConfigVps } from './config/assertConfigVps'
import { assertUsage, getNpmPackageName, toPosixPath } from '../utils'
import { findConfigVpsFromStemPackages } from './config/findConfigVpsFromStemPackages'
import path from 'path'

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
  const configs = [fromPluginOptions, ...fromStemPackages, fromViteConfig]

  const configVps: ConfigVpsResolved = {
    disableAutoFullBuild: pickFirst(configs.map((c) => c.disableAutoFullBuild)) ?? false,
    pageFiles: {
      include: configs.map((c) => c.pageFiles?.include ?? []).flat(),
      addPageFiles: resolveAddPageFiles(configs, config)
    },
    prerender: resolvePrerenderOptions(configs),
    includeCSS: configs.map((c) => c.includeCSS ?? []).flat(),
    includeAssetsImportedByServer: pickFirst(configs.map((c) => c.includeAssetsImportedByServer)) ?? false
  }

  return configVps
}

function resolveAddPageFiles(configs: ConfigVpsUserProvided[], config: ResolvedConfig) {
  const entries = configs.map((c) => c.pageFiles?.addPageFiles ?? []).flat()
  return entries.map((entry) => {
    const npmPackageName = getNpmPackageName(entry)
    assertUsage(npmPackageName, `Entry '${entry}' of pageFiles.addPageFiles should be a module of an npm package`)
    let entryResolved: string
    try {
      entryResolved = require.resolve(entry, { paths: [config.root] })
    } catch (err: any) {
      if (err?.code === 'ERR_PACKAGE_PATH_NOT_EXPORTED') {
        assertUsage(
          false,
          `Define ${entry} in package.json#exports of ${npmPackageName} with a Node.js export condition (even if it's a browser file like CSS).`
        )
      }
      throw err
    }
    let packageJsonPath: string
    try {
      packageJsonPath = require.resolve(`${npmPackageName}/package.json`, { paths: [config.root] })
    } catch (err: any) {
      if (err?.code === 'ERR_PACKAGE_PATH_NOT_EXPORTED') {
        assertUsage(false, `Cannot read ${npmPackageName}/package.json. Add package.json#exports["./package.json"] with the value "./package.json" to the package.json of ${npmPackageName}.`)
      }
      throw err
    }
    const npmPackageRootDir = path.posix.dirname(toPosixPath(packageJsonPath))
    return {
      entry,
      entryResolved,
      npmPackageName,
      npmPackageRootDir
    }
  })
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
