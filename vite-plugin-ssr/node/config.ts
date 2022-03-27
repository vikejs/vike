export const ssrConfig = getConfigObject()

import { isAbsolute } from 'path'
import { assertUsage, assertWarning, hasProp, assertUsageBaseUrl, checkType } from './utils'

type SsrConfig = {
  isProduction: boolean
  root: string | null
  outDir: string
  base: string
  baseAssets: string | null
  /**
   * @deprecated
   */
  viteDevServer: unknown
}

const configSpec = {
  isProduction: {
    validate(val: unknown) {
      assertUsage(val === true || val === false, '`ssrConfig.isProduction` should be `true` or `false`')
      checkType<SsrConfig['isProduction']>(val)
    },
    getDefault(): SsrConfig['isProduction'] {
      // If server environment is not a Node.js server, then we assume a (Cloudflare) worker environment
      if (typeof process == 'undefined' || !hasProp(process, 'env')) return true
      return process.env.NODE_ENV === 'production'
    },
  },
  root: {
    validate(val: unknown) {
      assertUsage(typeof val === 'string' && isAbsolute(val), '`ssrConfig.root` should be an absolute path')
      checkType<SsrConfig['root']>(val)
    },
    getDefault(): SsrConfig['root'] {
      if (typeof process == 'undefined' || !hasProp(process, 'cwd')) return null
      return process.cwd()
    },
  },
  outDir: {
    validate(val: unknown) {
      assertUsage(typeof val === 'string', '`ssrConfig.outDir` should be an string')
      checkType<SsrConfig['outDir']>(val)
    },
    getDefault(): SsrConfig['outDir'] {
      return 'dist'
    },
  },
  base: {
    validate(val: unknown) {
      assertUsage(typeof val === 'string', '`ssrConfig.base` should be an string')
      assertUsageBaseUrl(val, '`ssrConfig.base`: ')
      checkType<SsrConfig['base']>(val)
    },
    getDefault(): SsrConfig['base'] {
      return '/'
    },
  },
  baseAssets: {
    validate(val: unknown) {
      assertUsage(typeof val === 'string', '`ssrConfig.baseAssets` should be an string')
      checkType<SsrConfig['baseAssets']>(val)
    },
    getDefault(): SsrConfig['baseAssets'] {
      return null
    },
  },
  viteDevServer: {
    validate() {
      assertUsage(
        false,
        'vite-plugin-ssr is now able to automatically retrieve the Vite development server and `ssrConfig.viteDevServer` is not needed anymore.',
      )
    },
    getDefault() {
      return null
    },
  },
}

function getConfigObject(): SsrConfig {
  const configProvidedByUser: Partial<SsrConfig> = {}
  const ssrConfig = new Proxy({} as SsrConfig, { set, get })
  return ssrConfig

  function set(_: never, prop: keyof typeof configSpec, val: unknown) {
    const option = configSpec[prop]
    assertUsage(option, `Config \`ssrConfig.${prop}\` doesn't exist.`)
    option.validate(val)
    //@ts-ignore
    configProvidedByUser[prop] = val
    return true
  }
  function get(_: never, prop: keyof typeof configSpec) {
    if (!(prop in configSpec)) {
      assertWarning(false, `Config \`ssrConfig.${prop}\` doesn't exist.`, { onlyOnce: true })
      return undefined
    }
    return configProvidedByUser[prop] ?? configSpec[prop].getDefault()
  }
}
